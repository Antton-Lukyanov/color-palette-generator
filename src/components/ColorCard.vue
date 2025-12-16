<template>
  <div
    class="color-card"
    :style="{ backgroundColor: color.hex }"
    :class="{ locked: color.locked }"
  >
    <div class="color-info">
      <div class="color-value" :class="{ 'text-light': isDarkColor }">
        {{ formattedColor }}
      </div>
      <div class="color-actions">
        <button
          @click.stop="toggleLock"
          class="action-button lock-button"
          :title="color.locked ? 'Разблокировать' : 'Заблокировать'"
        >
          {{ color.locked ? "🔒" : "🔓" }}
        </button>
        <button
          @click.stop="copyColor"
          class="action-button copy-button"
          title="Копировать"
        >
          📋
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { hexToRgb, getColorBrightness } from "../composables/useColorUtils";

export default {
  name: "ColorCard",
  props: {
    color: {
      type: Object,
      required: true,
    },
    format: {
      type: String,
      default: "hex",
      validator: (value) => ["hex", "rgb"].includes(value),
    },
  },
  setup(props, { emit }) {
    // Форматированный цвет в зависимости от выбранного формата
    const formattedColor = computed(() => {
      if (props.format === "rgb") {
        const rgb = hexToRgb(props.color.hex);
        return rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : props.color.hex;
      }
      return props.color.hex.toUpperCase();
    });

    // Определяем, темный ли цвет для выбора цвета текста
    const isDarkColor = computed(() => {
      const brightness = getColorBrightness(props.color.hex);
      return brightness < 0.5;
    });

    // Переключение блокировки
    const toggleLock = () => {
      emit("lock");
    };

    // Копирование цвета
    const copyColor = () => {
      emit("copy", formattedColor.value, props.color.hex);
    };

    return {
      formattedColor,
      isDarkColor,
      toggleLock,
      copyColor,
    };
  },
};
</script>

<style scoped>
.color-card {
  height: 120px;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.color-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.color-card.locked {
  border: 3px solid #ffd700;
}

.color-info {
  background: rgba(255, 255, 255, 0.9);
  padding: 10px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.color-value {
  font-family: "Courier New", monospace;
  font-weight: bold;
  font-size: 14px;
  user-select: all;
}

.color-value.text-light {
  color: #333;
}

.color-actions {
  display: flex;
  gap: 5px;
}

.action-button {
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.2s ease;
}

.action-button:hover {
  background: white;
  transform: scale(1.1);
}

.lock-button:hover {
  background: #ffd700;
}

.copy-button:hover {
  background: #28a745;
  color: white;
}
</style>
