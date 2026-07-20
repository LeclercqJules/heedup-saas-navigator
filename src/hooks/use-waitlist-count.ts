import { useEffect, useState } from "react";

export const BASE_COUNT = 22;

export async function fetchTallyCount(): Promise<number> {
  try {
    const response = await fetch(
      "https://api.tally.so/forms/obpYab/submissions",
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_TALLY_API_KEY}`,
        },
      },
    );
    if (!response.ok) return BASE_COUNT;
    const data = await response.json();
    const submissions = data.totalNumberOfSubmissions ?? 0;
    return BASE_COUNT + submissions;
  } catch {
    return BASE_COUNT;
  }
}

export function useWaitlistCount(): number {
  const [count, setCount] = useState(BASE_COUNT);
  useEffect(() => {
    fetchTallyCount().then((n) => setCount(n));
  }, []);
  return count;
}
