export const BASE_COUNT = 22;

export function useWaitlistCount(): number {
  return BASE_COUNT;
}

export async function fetchTallyCount(): Promise<number> {
  return BASE_COUNT;
}
