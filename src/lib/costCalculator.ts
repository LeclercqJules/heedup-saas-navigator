export const DISENGAGEMENT_RATE = 0.07;
export const DISENGAGEMENT_COST_PER_EMPLOYEE = 14840;
export const DEPARTURE_COST = 22500;
export const DEPARTURE_COST_MIN = 15000;
export const DEPARTURE_COST_MAX = 30000;

export const DISENGAGEMENT_SOURCE =
  "Taux de désengagement : Gallup, France, 2024. Coût par salarié : IBET, 2024.";
export const DEPARTURE_COST_SOURCE = "Estimations sectorielles, 2024";

export function calculateDisengagedEmployees(employeeCount: number): number {
  return Math.round(employeeCount * DISENGAGEMENT_RATE);
}

export function calculateDisengagementCost(employeeCount: number): number {
  return calculateDisengagedEmployees(employeeCount) * DISENGAGEMENT_COST_PER_EMPLOYEE;
}

export function calculateHeedupAnnualCost(employeeCount: number): number {
  if (employeeCount < 25) return employeeCount * 5 * 12;
  if (employeeCount < 50) return employeeCount * 4.5 * 12;
  if (employeeCount < 100) return employeeCount * 4 * 12;
  return employeeCount * 3.5 * 12;
}