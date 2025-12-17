import { hexToRgb } from "./useColorUtils";

/**
 * Экспортирует палитру в CSS переменные
 */
export function exportToCssVariables(colors, paletteName = "palette") {
  let css = `/* CSS Variables for ${paletteName} */\n:root {\n`;

  colors.forEach((color, index) => {
    const variableName = `--${paletteName}-${index + 1}`;
    css += `  ${variableName}: ${color};\n`;
  });

  css += "}\n\n";

  // Добавляем пример использования
  css += "/* Usage example */\n";
  css += ".example {\n";
  css += `  background-color: var(--${paletteName}-1);\n`;
  css += `  color: var(--${paletteName}-5);\n`;
  css += "}\n";

  return css;
}

/**
 * Экспортирует палитру в SCSS переменные
 */
export function exportToScssVariables(colors, paletteName = "palette") {
  let scss = `/* SCSS Variables for ${paletteName} */\n`;

  colors.forEach((color, index) => {
    const variableName = `$${paletteName}-${index + 1}`;
    scss += `${variableName}: ${color};\n`;
  });

  scss += "\n";

  // Добавляем пример использования
  scss += "/* Usage example */\n";
  scss += ".example {\n";
  scss += `  background-color: $${paletteName}-1;\n`;
  scss += `  color: $${paletteName}-5;\n`;
  scss += "}\n";

  return scss;
}

/**
 * Экспортирует палитру в Tailwind конфиг
 */
export function exportToTailwindConfig(colors, paletteName = "palette") {
  let config = `// Tailwind CSS configuration for ${paletteName}\n`;
  config += "module.exports = {\n";
  config += "  theme: {\n";
  config += "    extend: {\n";
  config += "      colors: {\n";
  config += `        '${paletteName}': {\n`;

  colors.forEach((color, index) => {
    config += `          '${index + 1}': '${color}',\n`;
  });

  config += "        }\n";
  config += "      }\n";
  config += "    }\n";
  config += "  }\n";
  config += "}\n";

  return config;
}

/**
 * Экспортирует палитру в JSON
 */
export function exportToJson(colors, paletteName = "palette", metadata = {}) {
  const data = {
    name: paletteName,
    colors: colors,
    created: new Date().toISOString(),
    ...metadata,
  };

  return JSON.stringify(data, null, 2);
}

/**
 * Экспортирует палитру в разные форматы
 */
export function exportPalette(colors, format, paletteName = "palette") {
  switch (format) {
    case "css":
      return exportToCssVariables(colors, paletteName);
    case "scss":
      return exportToScssVariables(colors, paletteName);
    case "tailwind":
      return exportToTailwindConfig(colors, paletteName);
    case "json":
      return exportToJson(colors, paletteName);
    default:
      return exportToCssVariables(colors, paletteName);
  }
}

/**
 * Преобразует HEX в RGB строку
 */
export function hexToRgbString(hex) {
  const rgb = hexToRgb(hex);
  return rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : hex;
}

/**
 * Преобразует HEX в HSL строку
 */
export function hexToHslString(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}
