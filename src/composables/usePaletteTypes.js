/**
 * Генерация различных типов цветовых палитр
 */

import { hexToHsl, hslToRgb, rgbToHex } from "./useColorUtils";

/**
 * Генерирует монохромную палитру (разные оттенки одного цвета)
 * @param {string} baseColor - Базовый цвет в HEX формате
 * @param {number} count - Количество цветов в палитре
 * @returns {string[]} Массив цветов в HEX формате
 */
export function generateMonochromaticPalette(baseColor, count = 5) {
  const hsl = hexToHsl(baseColor);
  const palette = [baseColor];

  // Создаем более светлые и темные оттенки
  for (let i = 1; i < count; i++) {
    const lightnessStep = 100 / (count + 1);
    const saturationStep = 30 / (count + 1);

    const newHsl = {
      h: hsl.h,
      s: Math.max(
        20,
        Math.min(100, hsl.s + (i % 2 === 0 ? saturationStep : -saturationStep))
      ),
      l: Math.max(10, Math.min(90, hsl.l + (i * lightnessStep - 50))),
    };

    const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    palette.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  }

  return palette;
}

/**
 * Генерирует аналогичную палитру (соседние цвета на цветовом круге)
 * @param {string} baseColor - Базовый цвет в HEX формате
 * @param {number} count - Количество цветов в палитре
 * @param {number} spread - Разброс в градусах (по умолчанию 30)
 * @returns {string[]} Массив цветов в HEX формате
 */
export function generateAnalogousPalette(baseColor, count = 5, spread = 30) {
  const hsl = hexToHsl(baseColor);
  const palette = [baseColor];

  // Чередуем влево и вправо от базового цвета
  for (let i = 1; i < count; i++) {
    const direction = i % 2 === 0 ? 1 : -1;
    const steps = Math.ceil(i / 2);

    const newHsl = {
      h: (hsl.h + direction * steps * spread) % 360,
      s: hsl.s,
      l: hsl.l,
    };

    // Корректируем отрицательные значения
    if (newHsl.h < 0) newHsl.h += 360;

    const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    palette.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  }

  return palette;
}

/**
 * Генерирует комплементарную палитру (противоположные цвета)
 * @param {string} baseColor - Базовый цвет в HEX формате
 * @param {number} count - Количество цветов в палитре
 * @returns {string[]} Массив цветов в HEX формате
 */
export function generateComplementaryPalette(baseColor, count = 5) {
  const hsl = hexToHsl(baseColor);
  const complementaryHue = (hsl.h + 180) % 360;
  const palette = [baseColor];

  // Добавляем комплементарный цвет
  const compRgb = hslToRgb(complementaryHue, hsl.s, hsl.l);
  palette.push(rgbToHex(compRgb.r, compRgb.g, compRgb.b));

  // Добавляем промежуточные цвета
  for (let i = 2; i < count; i++) {
    const newHsl = {
      h: (hsl.h + i * 60) % 360,
      s: Math.max(50, Math.min(100, hsl.s + (i % 3 === 0 ? 10 : -10))),
      l: Math.max(30, Math.min(70, hsl.l + (i % 2 === 0 ? 5 : -5))),
    };

    const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    palette.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  }

  return palette;
}

/**
 * Генерирует триадную палитру (три равноудаленных цвета)
 * @param {string} baseColor - Базовый цвет в HEX формате
 * @param {number} count - Количество цветов в палитре
 * @returns {string[]} Массив цветов в HEX формате
 */
export function generateTriadicPalette(baseColor, count = 5) {
  const hsl = hexToHsl(baseColor);
  const palette = [baseColor];

  // Триадные цвета (120 градусов разницы)
  const triadicHues = [(hsl.h + 120) % 360, (hsl.h + 240) % 360];

  // Добавляем триадные цвета
  triadicHues.forEach((hue) => {
    const rgb = hslToRgb(hue, hsl.s, hsl.l);
    palette.push(rgbToHex(rgb.r, rgb.g, rgb.b));
  });

  // Добавляем дополнительные вариации
  for (let i = 3; i < count; i++) {
    const newHsl = {
      h: (hsl.h + i * 60) % 360,
      s: Math.max(60, Math.min(100, hsl.s + (i % 2 === 0 ? 15 : -15))),
      l: Math.max(40, Math.min(80, hsl.l + (i % 3 === 0 ? 10 : -10))),
    };

    const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    palette.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  }

  return palette;
}

/**
 * Генерирует тетрадную палитру (две комплементарные пары)
 * @param {string} baseColor - Базовый цвет в HEX формате
 * @param {number} count - Количество цветов в палитре
 * @returns {string[]} Массив цветов в HEX формате
 */
export function generateTetradicPalette(baseColor, count = 5) {
  const hsl = hexToHsl(baseColor);
  const palette = [baseColor];

  // Тетрадные цвета (90 градусов разницы)
  const tetradicHues = [
    (hsl.h + 90) % 360,
    (hsl.h + 180) % 360,
    (hsl.h + 270) % 360,
  ];

  // Добавляем тетрадные цвета
  tetradicHues.forEach((hue) => {
    const rgb = hslToRgb(hue, hsl.s, hsl.l);
    palette.push(rgbToHex(rgb.r, rgb.g, rgb.b));
  });

  // Добавляем дополнительные вариации
  for (let i = 4; i < count; i++) {
    const newHsl = {
      h: (hsl.h + i * 45) % 360,
      s: Math.max(40, Math.min(100, hsl.s + (i % 2 === 0 ? 20 : -20))),
      l: Math.max(20, Math.min(90, hsl.l + (i % 3 === 0 ? 15 : -15))),
    };

    const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    palette.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  }

  return palette;
}

/**
 * Генерирует расщепленную комплементарную палитру
 * @param {string} baseColor - Базовый цвет в HEX формате
 * @param {number} count - Количество цветов в палитре
 * @returns {string[]} Массив цветов в HEX формате
 */
export function generateSplitComplementaryPalette(baseColor, count = 5) {
  const hsl = hexToHsl(baseColor);
  const palette = [baseColor];

  // Расщепленные комплементарные цвета (±150 градусов от комплементарного)
  const splitHues = [(hsl.h + 150) % 360, (hsl.h + 210) % 360];

  // Добавляем расщепленные цвета
  splitHues.forEach((hue) => {
    const rgb = hslToRgb(hue, hsl.s, hsl.l);
    palette.push(rgbToHex(rgb.r, rgb.g, rgb.b));
  });

  // Добавляем дополнительные вариации
  for (let i = 3; i < count; i++) {
    const newHsl = {
      h: (hsl.h + i * 75) % 360,
      s: Math.max(50, Math.min(100, hsl.s + (i % 2 === 0 ? 12 : -12))),
      l: Math.max(25, Math.min(85, hsl.l + (i % 4 === 0 ? 8 : -8))),
    };

    const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    palette.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  }

  return palette;
}

/**
 * Генерирует квадратную палитру (4 равноудаленных цвета)
 * @param {string} baseColor - Базовый цвет в HEX формате
 * @param {number} count - Количество цветов в палитре
 * @returns {string[]} Массив цветов в HEX формате
 */
export function generateSquarePalette(baseColor, count = 5) {
  const hsl = hexToHsl(baseColor);
  const palette = [baseColor];

  // Квадратные цвета (90 градусов разницы)
  const squareHues = [
    (hsl.h + 90) % 360,
    (hsl.h + 180) % 360,
    (hsl.h + 270) % 360,
  ];

  // Добавляем квадратные цвета
  squareHues.forEach((hue) => {
    const rgb = hslToRgb(hue, hsl.s, hsl.l);
    palette.push(rgbToHex(rgb.r, rgb.g, rgb.b));
  });

  // Добавляем дополнительные вариации
  for (let i = 4; i < count; i++) {
    const newHsl = {
      h: (hsl.h + i * 72) % 360,
      s: Math.max(30, Math.min(100, hsl.s + (i % 3 === 0 ? 25 : -25))),
      l: Math.max(15, Math.min(95, hsl.l + (i % 2 === 0 ? 20 : -20))),
    };

    const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    palette.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  }

  return palette;
}

/**
 * Генерирует палитру на основе настроения
 * @param {string} mood - Настроение ('calm', 'energetic', 'professional', 'playful')
 * @param {number} count - Количество цветов в палитре
 * @returns {string[]} Массив цветов в HEX формате
 */
export function generateMoodPalette(mood, count = 5) {
  const moodPalettes = {
    calm: ["#667eea", "#5a67d8", "#4c51bf", "#434190", "#3c366b"],
    energetic: ["#f56565", "#ed8936", "#ecc94b", "#48bb78", "#4299e1"],
    professional: ["#1a202c", "#2d3748", "#4a5568", "#718096", "#cbd5e0"],
    playful: ["#f687b3", "#d6bcfa", "#9ae6b4", "#fbb6ce", "#b794f4"],
    nature: ["#38a169", "#2f855a", "#276749", "#22543d", "#1c4532"],
    sunset: ["#f6ad55", "#fc8181", "#f687b3", "#d69e2e", "#9c4221"],
    ocean: ["#3182ce", "#2b6cb0", "#2c5282", "#2a4365", "#1a365d"],
  };

  const basePalette = moodPalettes[mood] || moodPalettes.calm;

  if (count <= basePalette.length) {
    return basePalette.slice(0, count);
  }

  // Расширяем палитру если нужно больше цветов
  const extendedPalette = [...basePalette];
  for (let i = basePalette.length; i < count; i++) {
    const baseColor = basePalette[i % basePalette.length];
    const hsl = hexToHsl(baseColor);

    const newHsl = {
      h: (hsl.h + i * 30) % 360,
      s: Math.max(20, Math.min(100, hsl.s + (i % 2 === 0 ? 15 : -15))),
      l: Math.max(30, Math.min(80, hsl.l + (i % 3 === 0 ? 10 : -10))),
    };

    const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    extendedPalette.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  }

  return extendedPalette;
}

/**
 * Универсальная функция для генерации палитры по типу
 * @param {string} baseColor - Базовый цвет в HEX формате
 * @param {string} type - Тип палитры
 * @param {number} count - Количество цветов в палитре
 * @returns {string[]} Массив цветов в HEX формате
 */
export function generatePaletteByType(baseColor, type, count = 5) {
  switch (type) {
    case "monochromatic":
      return generateMonochromaticPalette(baseColor, count);
    case "analogous":
      return generateAnalogousPalette(baseColor, count);
    case "complementary":
      return generateComplementaryPalette(baseColor, count);
    case "triadic":
      return generateTriadicPalette(baseColor, count);
    case "tetradic":
      return generateTetradicPalette(baseColor, count);
    case "splitComplementary":
      return generateSplitComplementaryPalette(baseColor, count);
    case "square":
      return generateSquarePalette(baseColor, count);
    default:
      return generateAnalogousPalette(baseColor, count);
  }
}

/**
 * Создает градиент между двумя цветами
 * @param {string} color1 - Начальный цвет в HEX формате
 * @param {string} color2 - Конечный цвет в HEX формате
 * @param {number} steps - Количество шагов градиента
 * @returns {string[]} Массив цветов градиента в HEX формате
 */
export function createColorGradient(color1, color2, steps = 5) {
  const gradient = [];
  const hsl1 = hexToHsl(color1);
  const hsl2 = hexToHsl(color2);

  for (let i = 0; i < steps; i++) {
    const progress = i / (steps - 1);

    const h = hsl1.h + (hsl2.h - hsl1.h) * progress;
    const s = hsl1.s + (hsl2.s - hsl1.s) * progress;
    const l = hsl1.l + (hsl2.l - hsl1.l) * progress;

    const rgb = hslToRgb(h, s, l);
    gradient.push(rgbToHex(rgb.r, rgb.g, rgb.b));
  }

  return gradient;
}

/**
 * Создает палитру из нескольких градиентов
 * @param {string[]} colors - Массив основных цветов
 * @param {number} stepsPerGradient - Шагов на градиент
 * @returns {string[]} Объединенная палитра
 */
export function createMultiGradientPalette(colors, stepsPerGradient = 3) {
  if (colors.length < 2) {
    return [...colors];
  }

  const palette = [];

  for (let i = 0; i < colors.length - 1; i++) {
    const gradient = createColorGradient(
      colors[i],
      colors[i + 1],
      stepsPerGradient
    );

    if (i === 0) {
      palette.push(...gradient);
    } else {
      // Убираем первый цвет, чтобы не дублировать
      palette.push(...gradient.slice(1));
    }
  }

  return palette;
}

/**
 * Получает информацию о типе палитры
 * @param {string} type - Тип палитры
 * @returns {Object} Информация о типе
 */
export function getPaletteTypeInfo(type) {
  const typeInfo = {
    monochromatic: {
      name: "Монохромная",
      description: "Оттенки одного цвета",
      useCases: ["минимализм", "брендинг", "корпоративный стиль"],
      icon: "🎨",
    },
    analogous: {
      name: "Аналогичная",
      description: "Соседние цвета на цветовом круге",
      useCases: ["веб-сайты", "интерфейсы", "природные темы"],
      icon: "🌈",
    },
    complementary: {
      name: "Комплементарная",
      description: "Противоположные цвета",
      useCases: ["акценты", "CTA кнопки", "выделение"],
      icon: "⚡",
    },
    triadic: {
      name: "Триадная",
      description: "Три равноудаленных цвета",
      useCases: ["игры", "детские проекты", "креативный дизайн"],
      icon: "🔶",
    },
    tetradic: {
      name: "Тетрадная",
      description: "Две комплементарные пары",
      useCases: ["сложные интерфейсы", "игры", "дизайн данных"],
      icon: "🔷",
    },
    splitComplementary: {
      name: "Расщепленная",
      description: "Базовый цвет + два соседних к комплементарному",
      useCases: ["блоги", "портфолио", "образовательные платформы"],
      icon: "🎯",
    },
    square: {
      name: "Квадратная",
      description: "Четыре равноудаленных цвета",
      useCases: ["визуализация данных", "инфографика", "презентации"],
      icon: "⬛",
    },
  };

  return typeInfo[type] || typeInfo.analogous;
}

/**
 * Получает все доступные типы палитр
 * @returns {string[]} Массив типов палитр
 */
export function getAvailablePaletteTypes() {
  return [
    "monochromatic",
    "analogous",
    "complementary",
    "triadic",
    "tetradic",
    "splitComplementary",
    "square",
  ];
}

/**
 * Получает все доступные настроения для генерации палитр
 * @returns {string[]} Массив настроений
 */
export function getAvailableMoods() {
  return [
    "calm",
    "energetic",
    "professional",
    "playful",
    "nature",
    "sunset",
    "ocean",
  ];
}
