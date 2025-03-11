import { UvRiskLevels } from "@/types/weatherTypes";
import { uvDescriptions } from "./constants";

/**
 * Obtiene el nivel de riesgo UV basado en el índice UV.
 * @param index - Índice UV.
 * @returns Nivel de riesgo UV.
 */
export const getUvRiskLevel = (index: number): UvRiskLevels => {
  if (index < 0) return UvRiskLevels.unknown;
  if (index <= 2) return UvRiskLevels.low;
  if (index <= 7) return UvRiskLevels.moderate;
  return UvRiskLevels.high;
};

/**
 * Obtiene la descripción del riesgo UV basado en el índice UV.
 * @param index - Índice UV.
 * @returns Descripción del riesgo UV.
 */
export const getUvDescription = (index: number): string => {
  if (index < 0) return uvDescriptions.unknown;
  if (index <= 2) return uvDescriptions.low;
  if (index <= 7) return uvDescriptions.moderate;
  return uvDescriptions.high;
};
