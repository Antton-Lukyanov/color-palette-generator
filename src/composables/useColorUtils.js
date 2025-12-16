// Утилиты для работы с цветами

/**
 * Генерирует случайный HEX-цвет
 * @returns {string} HEX-цвет
 */
export function generateRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

/**
 * Преобразует HEX в RGB
 * @param {string} hex HEX-цвет
 * @returns {Object|null} Объект с r, g, b или null при ошибке
 */
export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Преобразует RGB в HEX
 * @param {number} r Красный (0-255)
 * @param {number} g Зеленый (0-255)
 * @param {number} b Синий (0-255)
 * @returns {string} HEX-цвет
 */
export function rgbToHex(r, g, b) {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
      .toUpperCase()
  );
}

/**
 * Вычисляет яркость цвета (0-1)
 * @param {string} hex HEX-цвет
 * @returns {number} Яркость от 0 до 1
 */
export function getColorBrightness(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0.5;

  // Формула восприятия яркости
  return (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
}

/**
 * Генерирует гармоничную палитру на основе базового цвета
 * @param {string} baseColor Базовый цвет
 * @param {number} count Количество цветов
 * @returns {string[]} Массив цветов
 */
export function generateHarmoniousPalette(baseColor, count = 5) {
  const rgb = hexToRgb(baseColor);
  if (!rgb) return Array(count).fill(baseColor);

  const palette = [baseColor];

  // Генерация дополнительных цветов на основе HSL
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  for (let i = 1; i < count; i++) {
    // Создаем вариации с разными значениями насыщенности и яркости
    const newHsl = {
      h: (hsl.h + i * 30) % 360,
      s: Math.min(100, Math.max(20, hsl.s + (i % 2 === 0 ? 10 : -10))),
      l: Math.min(80, Math.max(20, hsl.l + (i % 3 === 0 ? 5 : -5))),
    };

    const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    palette.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  }

  return palette;
}

/**
 * Преобразует RGB в HSL
 */
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
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

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Преобразует HSL в RGB
 */
function hslToRgb(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

/**
 * Настраивает яркость цвета
 * @param {string} hex HEX-цвет
 * @param {number} factor Фактор яркости (-1 до 1)
 * @returns {string} Новый HEX-цвет
 */
export function adjustColorBrightness(hex, factor) {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const adjustment = Math.round(factor * 255);

  const newRgb = {
    r: Math.min(255, Math.max(0, rgb.r + adjustment)),
    g: Math.min(255, Math.max(0, rgb.g + adjustment)),
    b: Math.min(255, Math.max(0, rgb.b + adjustment)),
  };

  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}
