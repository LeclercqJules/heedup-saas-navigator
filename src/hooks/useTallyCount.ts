import { useState, useEffect } from 'react';

const BASE_COUNT = 22;
let cachedCount: number | null = null;

async function fetchTallyCount(): Promise<number> {
  if (cachedCount !== null) return cachedCount;
  try {
    const response = await fetch(
      'https://api.tally.so/forms/VLBY9E/submissions',
      {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_TALLY_API_KEY}`
        }
      }
    );
    if (!response.ok) {
      cachedCount = BASE_COUNT;
      return BASE_COUNT;
    }
    const data = await response.json();
    const submissions = data.totalNumberOfSubmissions ?? 0;
    cachedCount = BASE_COUNT + submissions;
    return cachedCount as number;
  } catch {
    cachedCount = BASE_COUNT;
    return BASE_COUNT;
  }
}

export function useTallyCount() {
  const [count, setCount] = useState<number>(cachedCount ?? BASE_COUNT);

  useEffect(() => {
    fetchTallyCount().then(n => setCount(n));
  }, []);

  return count;
}
