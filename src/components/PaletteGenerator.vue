<template>
  <div class="palette-generator">
    <!-- Панель управления -->
    <div class="controls-panel">
      <div class="control-group">
        <label>Количество цветов:</label>
        <select v-model="colorsCount" class="control-select">
          <option value="3">3 цвета</option>
          <option value="5" selected>5 цветов</option>
          <option value="7">7 цветов</option>
        </select>
      </div>

      <div class="control-group">
        <label>Формат цвета:</label>
        <div class="format-toggle">
          <button
            @click="colorFormat = 'hex'"
            :class="{ active: colorFormat === 'hex' }"
            class="format-button"
          >
            HEX
          </button>
          <button
            @click="colorFormat = 'rgb'"
            :class="{ active: colorFormat === 'rgb' }"
            class="format-button"
          >
            RGB
          </button>
        </div>
      </div>

      <div class="control-group">
        <label>Тема превью:</label>
        <div class="theme-toggle">
          <button
            @click="previewTheme = 'light'"
            :class="{ active: previewTheme === 'light' }"
            class="theme-button"
          >
            Светлая
          </button>
          <button
            @click="previewTheme = 'dark'"
            :class="{ active: previewTheme === 'dark' }"
            class="theme-button"
          >
            Темная
          </button>
        </div>
      </div>

      <div class="button-group">
        <button @click="generateRandomPalette" class="generate-button">
          🎲 Случайная палитра
        </button>
        <button @click="savePalette" class="save-button">
          💾 Сохранить палитру
        </button>
      </div>
    </div>

    <!-- Отображение палитры -->
    <div class="palette-display">
      <div v-for="color in currentPalette" :key="color.id" class="palette-item">
        <ColorCard
          :color="color"
          :format="colorFormat"
          :isLocked="color.locked"
          @lock="toggleLock(color.id)"
          @copy="copyToClipboard"
        />
      </div>
    </div>

    <!-- Превью палитры -->
    <div class="preview-section">
      <h3>Превью интерфейса</h3>
      <PalettePreview :colors="currentPalette" :theme="previewTheme" />
    </div>

    <!-- Информация о сохраненных палитрах -->
    <div v-if="savedPalettes.length > 0" class="saved-palettes">
      <h3>Сохраненные палитры</h3>
      <div class="palettes-grid">
        <div
          v-for="(palette, index) in savedPalettes"
          :key="index"
          class="saved-palette"
          @click="loadPalette(palette)"
        >
          <div class="palette-colors">
            <div
              v-for="color in palette"
              :key="color.id"
              class="saved-color"
              :style="{ backgroundColor: color.hex }"
            ></div>
          </div>
          <p class="palette-name">Палитра {{ index + 1 }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from "vue";
import ColorCard from "./ColorCard.vue";
import PalettePreview from "./PalettePreview.vue";
import {
  generateRandomColor,
  generateHarmoniousPalette,
} from "../composables/useColorUtils";

export default {
  name: "PaletteGenerator",
  components: {
    ColorCard,
    PalettePreview,
  },
  setup() {
    // Реактивные данные
    const colorsCount = ref(5);
    const colorFormat = ref("hex");
    const previewTheme = ref("light");
    const currentPalette = ref([]);
    const savedPalettes = ref([]);

    // Генерация случайной палитры
    const generateRandomPalette = () => {
      const baseColor = generateRandomColor();
      const newPalette = generateHarmoniousPalette(
        baseColor,
        parseInt(colorsCount.value)
      );

      // Сохраняем закрепленные цвета
      const lockedColors = currentPalette.value.filter((color) => color.locked);
      const unlockedColors = newPalette.filter((_, index) => {
        return !currentPalette.value[index]?.locked;
      });

      // Создаем новую палитру с сохранением закрепленных цветов
      currentPalette.value = Array.from(
        { length: parseInt(colorsCount.value) },
        (_, index) => {
          if (currentPalette.value[index]?.locked) {
            return currentPalette.value[index];
          }
          return {
            id: Date.now() + index,
            hex:
              unlockedColors[index % unlockedColors.length] ||
              generateRandomColor(),
            locked: false,
          };
        }
      );
    };

    // Переключение блокировки цвета
    const toggleLock = (colorId) => {
      const colorIndex = currentPalette.value.findIndex(
        (color) => color.id === colorId
      );
      if (colorIndex !== -1) {
        currentPalette.value[colorIndex].locked =
          !currentPalette.value[colorIndex].locked;
      }
    };

    // Копирование в буфер обмена
    const copyToClipboard = (text, colorName) => {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          // Показать уведомление через глобальное событие или props
          const event = new CustomEvent("show-notification", {
            detail: {
              message: `Цвет ${colorName} скопирован!`,
              type: "success",
            },
          });
          window.dispatchEvent(event);
        })
        .catch((err) => {
          console.error("Ошибка копирования:", err);
          const event = new CustomEvent("show-notification", {
            detail: {
              message: "Ошибка копирования",
              type: "error",
            },
          });
          window.dispatchEvent(event);
        });
    };

    // Сохранение палитры
    const savePalette = () => {
      savedPalettes.value.push([...currentPalette.value]);
      localStorage.setItem(
        "savedPalettes",
        JSON.stringify(savedPalettes.value)
      );

      const event = new CustomEvent("show-notification", {
        detail: {
          message: "Палитра сохранена!",
          type: "success",
        },
      });
      window.dispatchEvent(event);
    };

    // Загрузка палитры
    const loadPalette = (palette) => {
      currentPalette.value = palette.map((color) => ({
        ...color,
        id: Date.now() + Math.random(),
      }));
    };

    // Загрузка сохраненных данных при монтировании
    onMounted(() => {
      // Генерация начальной палитры
      generateRandomPalette();

      // Загрузка сохраненных палитр
      const saved = localStorage.getItem("savedPalettes");
      if (saved) {
        savedPalettes.value = JSON.parse(saved);
      }
    });

    // Следим за изменением количества цветов
    watch(colorsCount, (newCount) => {
      if (currentPalette.value.length < newCount) {
        // Добавляем новые цвета
        const colorsToAdd = newCount - currentPalette.value.length;
        for (let i = 0; i < colorsToAdd; i++) {
          currentPalette.value.push({
            id: Date.now() + i,
            hex: generateRandomColor(),
            locked: false,
          });
        }
      } else if (currentPalette.value.length > newCount) {
        // Удаляем цвета (кроме заблокированных)
        const unlockedColors = currentPalette.value.filter(
          (color) => !color.locked
        );
        const colorsToRemove = currentPalette.value.length - newCount;

        if (unlockedColors.length >= colorsToRemove) {
          // Удаляем разблокированные цвета
          for (let i = 0; i < colorsToRemove; i++) {
            const lastUnlockedIndex = currentPalette.value.findLastIndex(
              (color) => !color.locked
            );
            if (lastUnlockedIndex !== -1) {
              currentPalette.value.splice(lastUnlockedIndex, 1);
            }
          }
        }
      }
    });

    return {
      colorsCount,
      colorFormat,
      previewTheme,
      currentPalette,
      savedPalettes,
      generateRandomPalette,
      toggleLock,
      copyToClipboard,
      savePalette,
      loadPalette,
    };
  },
};
</script>

<style scoped>
.palette-generator {
  padding: 20px;
}

.controls-panel {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.control-group label {
  font-weight: 600;
  color: #555;
}

.control-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
}

.format-toggle,
.theme-toggle {
  display: flex;
  gap: 5px;
}

.format-button,
.theme-button {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.format-button:hover,
.theme-button:hover {
  background-color: #f5f5f5;
}

.format-button.active,
.theme-button.active {
  background-color: #667eea;
  color: white;
  border-color: #667eea;
}

.button-group {
  display: flex;
  gap: 10px;
  align-items: flex-end;
}

.generate-button,
.save-button {
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.generate-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.save-button {
  background-color: #28a745;
  color: white;
}

.generate-button:hover,
.save-button:hover {
  transform: translateY(-2px);
}

.palette-display {
  display: flex;
  gap: 10px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.palette-item {
  flex: 1;
  min-width: 150px;
}

.preview-section {
  margin-bottom: 40px;
}

.preview-section h3 {
  margin-bottom: 15px;
  color: #333;
}

.saved-palettes {
  margin-top: 40px;
}

.saved-palettes h3 {
  margin-bottom: 15px;
  color: #333;
}

.palettes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
}

.saved-palette {
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.saved-palette:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.palette-colors {
  display: flex;
  height: 40px;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 10px;
}

.saved-color {
  flex: 1;
}

.palette-name {
  text-align: center;
  font-size: 12px;
  color: #666;
  margin: 0;
}

@media (max-width: 768px) {
  .controls-panel {
    grid-template-columns: 1fr;
  }

  .palette-display {
    flex-direction: column;
  }

  .palette-item {
    min-width: 100%;
  }
}
</style>
