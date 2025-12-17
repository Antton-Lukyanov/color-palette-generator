import { hexToRgb, getColorBrightness } from "./useColorUtils";

/**
 * Вычисляет контрастность между двумя цветами по WCAG
 */
export function calculateContrastRatio(color1, color2) {
  const luminance1 = calculateRelativeLuminance(color1);
  const luminance2 = calculateRelativeLuminance(color2);

  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Вычисляет относительную яркость по WCAG
 */
function calculateRelativeLuminance(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;

  const rsrgb = rgb.r / 255;
  const gsrgb = rgb.g / 255;
  const bsrgb = rgb.b / 255;

  const r =
    rsrgb <= 0.03928 ? rsrgb / 12.92 : Math.pow((rsrgb + 0.055) / 1.055, 2.4);
  const g =
    gsrgb <= 0.03928 ? gsrgb / 12.92 : Math.pow((gsrgb + 0.055) / 1.055, 2.4);
  const b =
    bsrgb <= 0.03928 ? bsrgb / 12.92 : Math.pow((bsrgb + 0.055) / 1.055, 2.4);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Определяет уровень доступности по WCAG
 */
export function getAccessibilityLevel(contrastRatio) {
  if (contrastRatio >= 7) {
    return { level: "AAA", score: "Отлично", color: "#28a745" };
  } else if (contrastRatio >= 4.5) {
    return { level: "AA", score: "Хорошо", color: "#17a2b8" };
  } else if (contrastRatio >= 3) {
    return { level: "AA Large", score: "Приемлемо", color: "#ffc107" };
  } else {
    return { level: "Fail", score: "Недостаточно", color: "#dc3545" };
  }
}

/**
 * Проверяет, достаточно ли контраста для текста
 */
export function isTextReadable(
  textColor,
  backgroundColor,
  textSize = "normal"
) {
  const ratio = calculateContrastRatio(textColor, backgroundColor);

  if (textSize === "large") {
    return ratio >= 3; // WCAG AA для крупного текста
  }

  return ratio >= 4.5; // WCAG AA для обычного текста
}

/**
 * Находит оптимальный цвет текста для фона
 */
export function getOptimalTextColor(backgroundColor) {
  const brightness = getColorBrightness(backgroundColor);
  return brightness > 0.5 ? "#000000" : "#ffffff";
}

/**
 * Анализирует всю палитру на доступность
 */
export function analyzePaletteAccessibility(colors) {
  const analysis = [];

  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      const contrast = calculateContrastRatio(colors[i], colors[j]);
      const accessibility = getAccessibilityLevel(contrast);

      analysis.push({
        color1: colors[i],
        color2: colors[j],
        contrast: contrast.toFixed(2),
        level: accessibility.level,
        score: accessibility.score,
        isReadable: contrast >= 4.5,
      });
    }
  }

  return analysis;
}
