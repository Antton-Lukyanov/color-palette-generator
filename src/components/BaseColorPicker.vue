<template>
  <div class="base-color-picker">
    <h3>🎨 Выберите базовый цвет</h3>

    <div class="color-inputs">
      <div class="input-group">
        <label>HEX код:</label>
        <div class="hex-input-wrapper">
          <input
            type="text"
            v-model="hexValue"
            @input="updateFromHex"
            placeholder="#FF5733"
            class="hex-input"
          />
          <div
            class="color-preview"
            :style="{ backgroundColor: hexValue }"
          ></div>
        </div>
      </div>

      <div class="input-group">
        <label>Или выберите из палитры:</label>
        <div class="preset-colors">
          <button
            v-for="color in presetColors"
            :key="color"
            :style="{ backgroundColor: color }"
            @click="selectPresetColor(color)"
            class="preset-color-btn"
            :title="color"
          ></button>
        </div>
      </div>

      <div class="input-group">
        <label>Цветовой круг:</label>
        <div class="color-wheel">
          <div
            ref="colorWheel"
            @click="pickColorFromWheel"
            class="wheel-canvas"
          >
            <div
              class="wheel-marker"
              :style="{
                left: markerPosition.x + 'px',
                top: markerPosition.y + 'px',
              }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <div class="current-color-info">
      <div
        class="color-display"
        :style="{ backgroundColor: selectedColor }"
      ></div>
      <div class="color-details">
        <p><strong>HEX:</strong> {{ selectedColor }}</p>
        <p><strong>RGB:</strong> {{ rgbValue }}</p>
        <p><strong>HSL:</strong> {{ hslValue }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { hexToRgb, rgbToHex } from "../composables/useColorUtils";

export default {
  name: "BaseColorPicker",

  props: {
    modelValue: {
      type: String,
      default: "#667eea",
    },
  },

  emits: ["update:modelValue"],

  setup(props, { emit }) {
    const selectedColor = ref(props.modelValue);
    const hexValue = ref(props.modelValue);
    const markerPosition = ref({ x: 100, y: 100 });
    const colorWheel = ref(null);

    const presetColors = [
      "#667eea",
      "#764ba2",
      "#f093fb",
      "#f5576c",
      "#4facfe",
      "#00f2fe",
      "#43e97b",
      "#38f9d7",
      "#fa709a",
      "#fee140",
      "#a8edea",
      "#fed6e3",
      "#ff9a9e",
      "#fad0c4",
      "#a1c4fd",
      "#c2e9fb",
    ];

    const rgbValue = computed(() => {
      const rgb = hexToRgb(selectedColor.value);
      return rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : "";
    });

    const hslValue = computed(() => {
      const rgb = hexToRgb(selectedColor.value);
      if (!rgb) return "";

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
    });

    const updateFromHex = () => {
      if (/^#[0-9A-F]{6}$/i.test(hexValue.value)) {
        selectedColor.value = hexValue.value.toUpperCase();
        emit("update:modelValue", selectedColor.value);
      }
    };

    const selectPresetColor = (color) => {
      selectedColor.value = color;
      hexValue.value = color;
      emit("update:modelValue", color);
    };

    const pickColorFromWheel = (event) => {
      if (!colorWheel.value) return;

      const rect = colorWheel.value.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      markerPosition.value = { x, y };

      // Простая генерация цвета по позиции (для демо)
      const hue = (x / rect.width) * 360;
      const saturation = 70;
      const lightness = 50 - (y / rect.height) * 30;

      // Конвертация HSL в HEX (упрощенная)
      const newColor = hslToHex(hue, saturation, lightness);
      selectedColor.value = newColor;
      hexValue.value = newColor;
      emit("update:modelValue", newColor);
    };

    const hslToHex = (h, s, l) => {
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

      return rgbToHex(
        Math.round(r * 255),
        Math.round(g * 255),
        Math.round(b * 255)
      );
    };

    onMounted(() => {
      // Инициализация позиции маркера по текущему цвету
      updateMarkerPosition();
    });

    const updateMarkerPosition = () => {
      // Простая логика для демо
      markerPosition.value = { x: 100, y: 100 };
    };

    return {
      selectedColor,
      hexValue,
      markerPosition,
      colorWheel,
      presetColors,
      rgbValue,
      hslValue,
      updateFromHex,
      selectPresetColor,
      pickColorFromWheel,
    };
  },
};
</script>

<style scoped>
.base-color-picker {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.base-color-picker h3 {
  margin-bottom: 20px;
  color: #333;
}

.color-inputs {
  display: grid;
  gap: 20px;
  margin-bottom: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group label {
  font-weight: 600;
  color: #555;
  font-size: 14px;
}

.hex-input-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.hex-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-family: "Courier New", monospace;
  font-size: 14px;
}

.color-preview {
  width: 40px;
  height: 40px;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.preset-colors {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 5px;
}

.preset-color-btn {
  width: 30px;
  height: 30px;
  border: 2px solid transparent;
  border-radius: 50%;
  cursor: pointer;
  transition:
    transform 0.2s,
    border-color 0.2s;
}

.preset-color-btn:hover {
  transform: scale(1.1);
  border-color: #333;
}

.wheel-canvas {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    #ff0000,
    #ffff00,
    #00ff00,
    #00ffff,
    #0000ff,
    #ff00ff,
    #ff0000
  );
  position: relative;
  cursor: crosshair;
  border: 2px solid #ddd;
}

.wheel-marker {
  width: 16px;
  height: 16px;
  border: 2px solid white;
  border-radius: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
  pointer-events: none;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}

.current-color-info {
  display: flex;
  gap: 20px;
  align-items: center;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.color-display {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  border: 2px solid #ddd;
  flex-shrink: 0;
}

.color-details {
  flex: 1;
}

.color-details p {
  margin: 5px 0;
  font-size: 14px;
}

.color-details strong {
  color: #555;
  margin-right: 5px;
}

@media (max-width: 768px) {
  .preset-colors {
    grid-template-columns: repeat(4, 1fr);
  }

  .wheel-canvas {
    width: 150px;
    height: 150px;
  }

  .current-color-info {
    flex-direction: column;
    text-align: center;
  }
}
</style>
