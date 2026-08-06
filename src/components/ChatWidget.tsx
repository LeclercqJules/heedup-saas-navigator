import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useRouter } from "@tanstack/react-router";
import { HEEDUP_SUPABASE_URL, HEEDUP_PUBLISHABLE_KEY } from "@/config/heedupBackend";

type ChatMessage = { role: "user" | "assistant"; content: string };

const ENDPOINT = `${HEEDUP_SUPABASE_URL}/functions/v1/chat-widget`;

const WELCOME =
  "Bonjour, je suis Léo. Je réponds à vos questions sur HeedUp : fonctionnement, tarifs, confidentialité des réponses. Qu'est-ce qui vous amène ?";

const ERROR_TEXT =
  "Désolé, je n'arrive pas à répondre pour le moment. Réessayez dans un instant ou écrivez-nous à contact@heedup.fr.";

function ChatPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: WELCOME },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const sid = sessionId ?? crypto.randomUUID();
    if (!sessionId) setSessionId(sid);

    const history = messages.slice(-20);
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ message: text, history, session_id: sid }),
      });
      if (!res.ok) throw new Error("bad status");
      const data = (await res.json()) as { reply_text?: string };
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply_text || ERROR_TEXT },
      ]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: ERROR_TEXT }]);
    } finally {
      setLoading(false);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  };

  return (
    <div
      className="heedup-chat-panel"
      role="dialog"
      aria-label="Conversation avec Léo, assistant HeedUp"
      style={{
        width: "380px",
        maxHeight: "560px",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg-card)",
        borderRadius: "16px",
        border: "1px solid rgba(13,27,62,0.08)",
        boxShadow: "0 12px 40px rgba(13,27,62,0.18)",
        overflow: "hidden",
        marginBottom: "12px",
        fontFamily: "var(--font-sans)",
      }}
    >
      <div
        style={{
          background: "var(--midnight)",
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        <div>
          <div style={{ color: "#FFFFFF", fontSize: "15px", fontWeight: 700 }}>Léo</div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px" }}>Assistant HeedUp</div>
        </div>
        <button
          type="button"
          aria-label="Fermer la conversation"
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            color: "rgba(255,255,255,0.8)",
            cursor: "pointer",
            fontSize: "18px",
            lineHeight: 1,
            padding: "4px",
          }}
        >
          ✕
        </button>
      </div>

      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          minHeight: "220px",
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              background: m.role === "user" ? "var(--indigo-pale)" : "var(--bg-main)",
              color: "var(--text-primary)",
              borderRadius: "12px",
              padding: "10px 12px",
              fontSize: "14px",
              lineHeight: 1.55,
              maxWidth: "85%",
              whiteSpace: "pre-wrap",
            }}
          >
            {m.content}
          </div>
        ))}
        {loading && (
          <div
            aria-live="polite"
            style={{
              alignSelf: "flex-start",
              background: "var(--bg-main)",
              borderRadius: "12px",
              padding: "12px",
              display: "flex",
              gap: "4px",
            }}
          >
            {[0, 1, 2].map((d) => (
              <span
                key={d}
                className="heedup-chat-dot"
                style={{ animationDelay: `${d * 0.16}s` } as CSSProperties}
              />
            ))}
          </div>
        )}
      </div>

      <div
        style={{
          borderTop: "1px solid rgba(13,27,62,0.08)",
          padding: "10px",
          display: "flex",
          gap: "8px",
          alignItems: "flex-end",
        }}
      >
        <textarea
          ref={inputRef}
          value={input}
          disabled={loading}
          rows={1}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void send();
            }
          }}
          placeholder="Votre question"
          aria-label="Votre message"
          style={{
            flex: 1,
            resize: "none",
            maxHeight: "96px",
            border: "1px solid rgba(13,27,62,0.12)",
            borderRadius: "8px",
            padding: "10px",
            fontSize: "14px",
            fontFamily: "inherit",
            color: "var(--text-primary)",
            background: "var(--bg-card)",
            outline: "none",
          }}
        />
        <button
          type="button"
          onClick={() => void send()}
          disabled={loading || !input.trim()}
          aria-label="Envoyer le message"
          style={{
            background: "var(--indigo)",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "8px",
            padding: "10px 14px",
            fontSize: "14px",
            fontWeight: 700,
            cursor: loading || !input.trim() ? "default" : "pointer",
            opacity: loading || !input.trim() ? 0.5 : 1,
          }}
        >
          →
        </button>
      </div>
    </div>
  );
}

export function ChatWidget() {
  const router = useRouter();
  const pathname = router.state.location.pathname;
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (pathname === "/connexion" || pathname.startsWith("/admin")) return null;

  const toggle = () => {
    setMounted(true);
    setOpen((v) => !v);
  };

  return (
    <div
      className="heedup-chat-widget"
      style={{
        position: "fixed",
        right: "24px",
        bottom: "88px",
        zIndex: 200,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
      }}
    >
      {mounted && open && <ChatPanel onClose={() => setOpen(false)} />}
      <button
        type="button"
        aria-label={open ? "Fermer le chat avec Léo" : "Ouvrir le chat avec Léo"}
        aria-expanded={open}
        onClick={toggle}
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "var(--indigo)",
          color: "#FFFFFF",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 24px rgba(13,27,62,0.22)",
          fontSize: "22px",
          lineHeight: 1,
        }}
      >
        {open ? "✕" : "💬"}
      </button>
    </div>
  );
}
