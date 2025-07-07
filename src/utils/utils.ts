import { UvRiskLevels } from "../types/weatherTypes";
import { UV_RISK_CONFIG } from "./constants";

/**
 * Obtiene el nivel de riesgo UV basado en el índice UV.
 * @param index - Índice UV.
 * @returns Nivel de riesgo UV.
 */
export const getUvRiskLevel = (index: number): UvRiskLevels => {
  if (index < 0) return UvRiskLevels.UNKNOWN;
  if (index <= 2) return UvRiskLevels.LOW;
  if (index <= 7) return UvRiskLevels.MODERATE;
  return UvRiskLevels.HIGH;
};

/**
 * Obtiene la descripción del riesgo UV basado en el índice UV.
 * @param index - Índice UV.
 * @returns Descripción del riesgo UV.
 */
export const getUvDescription = (index: number): string => {
  if (index < 0) return UV_RISK_CONFIG.DESCRIPTIONS[UvRiskLevels.UNKNOWN];
  if (index <= 2) return UV_RISK_CONFIG.DESCRIPTIONS[UvRiskLevels.LOW];
  if (index <= 7) return UV_RISK_CONFIG.DESCRIPTIONS[UvRiskLevels.MODERATE];
  return UV_RISK_CONFIG.DESCRIPTIONS[UvRiskLevels.HIGH];
};
