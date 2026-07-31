export function CalloutStatement({ text }: { text: string }) {
  return (
    <div className="callout-statement fade-up">
      <p className="callout-statement-text">{text}</p>
    </div>
  );
}
