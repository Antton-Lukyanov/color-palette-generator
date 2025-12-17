<template>
  <div class="palette-generator">
    <!-- Панель навигации -->
    <nav class="generator-nav">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        class="nav-tab"
        :class="{ active: activeTab === tab.id }"
      >
        {{ tab.icon }} {{ tab.name }}
      </button>
    </nav>

    <!-- Вкладка генерации -->
    <div v-if="activeTab === 'generate'" class="tab-content">
      <div class="generation-panel">
        <div class="panel-left">
          <BaseColorPicker v-model="baseColor" />
          <PaletteTypeSelector v-model="paletteType" />
        </div>

        <div class="panel-right">
          <div class="controls-panel">
            <div class="control-group">
              <label>Количество цветов:</label>
              <select v-model="colorsCount" class="control-select">
                <option value="3">3 цвета</option>
                <option value="5" selected>5 цветов</option>
                <option value="7">7 цветов</option>
                <option value="9">9 цветов</option>
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
                <button
                  @click="colorFormat = 'hsl'"
                  :class="{ active: colorFormat === 'hsl' }"
                  class="format-button"
                >
                  HSL
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
              <button @click="generateNewPalette" class="generate-button">
                🎲 Сгенерировать палитру
              </button>
              <button @click="randomizeAll" class="randomize-button">
                🔀 Случайно всё
              </button>
            </div>
          </div>

          <!-- Отображение палитры -->
          <div class="palette-display">
            <div
              v-for="color in currentPalette"
              :key="color.id"
              class="palette-item"
            >
              <ColorCard
                :color="color"
                :format="colorFormat"
                :isLocked="color.locked"
                @lock="toggleLock(color.id)"
                @copy="copyToClipboard"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Превью палитры -->
      <div class="preview-section">
        <h3>Превью интерфейса</h3>
        <PalettePreview :colors="currentPaletteColors" :theme="previewTheme" />
      </div>
    </div>

    <!-- Вкладка анализа -->
    <div v-else-if="activeTab === 'analyze'" class="tab-content">
      <ColorAnalyzer :colors="currentPaletteColors" />
    </div>

    <!-- Вкладка библиотеки -->
    <div v-else-if="activeTab === 'library'" class="tab-content">
      <PaletteLibrary
        :current-colors="currentPaletteColors"
        @load-palette="loadPaletteFromLibrary"
      />
    </div>

    <!-- Вкладка экспорта -->
    <div v-else-if="activeTab === 'export'" class="tab-content">
      <ExportPanel
        :colors="currentPalette"
        :palette-name="currentPaletteName"
      />
    </div>

    <!-- Уведомления -->
    <Notification
      :message="notification.message"
      :type="notification.type"
      :visible="notification.visible"
      @close="notification.visible = false"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from "vue";
import BaseColorPicker from "./BaseColorPicker.vue";
import PaletteTypeSelector from "./PaletteTypeSelector.vue";
import ColorCard from "./ColorCard.vue";
import PalettePreview from "./PalettePreview.vue";
import ColorAnalyzer from "./ColorAnalyzer.vue";
import PaletteLibrary from "./PaletteLibrary.vue";
import ExportPanel from "./ExportPanel.vue";
import Notification from "./Notification.vue";
import {
  generateRandomColor,
  generatePalette as generatePaletteFromUtils, // <-- переименовали импорт!
} from "../composables/useColorUtils";
import {
  hexToRgbString,
  hexToHslString,
} from "../composables/usePaletteExport";

export default {
  name: "PaletteGenerator",

  components: {
    BaseColorPicker,
    PaletteTypeSelector,
    ColorCard,
    PalettePreview,
    ColorAnalyzer,
    PaletteLibrary,
    ExportPanel,
    Notification,
  },

  setup() {
    // Реактивные данные
    const activeTab = ref("generate");
    const baseColor = ref("#667eea");
    const paletteType = ref("analogous");
    const colorsCount = ref(5);
    const colorFormat = ref("hex");
    const previewTheme = ref("light");
    const currentPalette = ref([]);
    const currentPaletteName = ref("Моя палитра");

    // Уведомления
    const notification = ref({
      message: "",
      type: "success",
      visible: false,
    });

    // Вкладки
    const tabs = [
      { id: "generate", name: "Генерация", icon: "🎨" },
      { id: "analyze", name: "Анализ", icon: "🔍" },
      { id: "library", name: "Библиотека", icon: "📚" },
      { id: "export", name: "Экспорт", icon: "📥" },
    ];

    // Вычисляемые свойства
    const currentPaletteColors = computed(() => {
      return currentPalette.value.map((color) => color.hex);
    });

    // Генерация палитры на основе выбранных параметров
    const generateNewPalette = () => {
      // <-- переименовали метод!
      try {
        console.log("Генерация палитры с параметрами:", {
          baseColor: baseColor.value,
          paletteType: paletteType.value,
          count: parseInt(colorsCount.value),
        });

        // Используем ПЕРЕИМЕНОВАННУЮ функцию из utils
        const colors = generatePaletteFromUtils(
          baseColor.value,
          paletteType.value,
          parseInt(colorsCount.value)
        );

        console.log("Сгенерированные цвета:", colors);

        // Сохраняем закрепленные цвета
        const lockedColors = currentPalette.value.filter(
          (color) => color.locked
        );
        const unlockedColors = colors.filter((_, index) => {
          return !currentPalette.value[index]?.locked;
        });

        // Создаем новую палитру с сохранением закрепленных цветов
        const newPalette = Array.from(
          { length: parseInt(colorsCount.value) },
          (_, index) => {
            // Если цвет был закреплен, оставляем его
            if (currentPalette.value[index]?.locked) {
              return currentPalette.value[index];
            }

            // Берем цвет из сгенерированной палитры или случайный
            const colorValue =
              unlockedColors[index % unlockedColors.length] ||
              generateRandomColor();

            return {
              id: Date.now() + index,
              hex: colorValue,
              locked: false,
              rgb: hexToRgbString(colorValue),
              hsl: hexToHslString(colorValue),
            };
          }
        );

        currentPalette.value = newPalette;

        // Обновляем имя палитры
        currentPaletteName.value = `${getPaletteTypeName(
          paletteType.value
        )} палитра`;

        showNotification("Палитра сгенерирована!", "success");
      } catch (error) {
        console.error("Ошибка при генерации палитры:", error);
        showNotification("Ошибка при генерации палитры", "error");
      }
    };

    // Случайная генерация всех параметров
    const randomizeAll = () => {
      const paletteTypes = [
        "analogous",
        "monochromatic",
        "triadic",
        "complementary",
        "tetradic",
        "splitComplementary",
      ];
      const randomType =
        paletteTypes[Math.floor(Math.random() * paletteTypes.length)];

      baseColor.value = generateRandomColor();
      paletteType.value = randomType;
      colorsCount.value = [3, 5, 7, 9][Math.floor(Math.random() * 4)];

      generateNewPalette(); // <-- используем переименованный метод
    };

    // Получение названия типа палитры
    const getPaletteTypeName = (type) => {
      const names = {
        analogous: "Аналогичная",
        monochromatic: "Монохромная",
        triadic: "Триадная",
        complementary: "Комплементарная",
        tetradic: "Тетрадная",
        splitComplementary: "Расщепленная",
      };

      return names[type] || "Аналогичная";
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
          showNotification(`Цвет ${colorName} скопирован!`, "success");
        })
        .catch((err) => {
          console.error("Ошибка копирования:", err);
          showNotification("Ошибка копирования", "error");
        });
    };

    // Загрузка палитры из библиотеки
    const loadPaletteFromLibrary = (colors) => {
      currentPalette.value = colors.map((color, index) => ({
        id: Date.now() + index,
        hex: color,
        locked: false,
        rgb: hexToRgbString(color),
        hsl: hexToHslString(color),
      }));

      showNotification("Палитра загружена из библиотеки", "success");
    };

    // Показ уведомления
    const showNotification = (message, type = "success") => {
      notification.value = {
        message,
        type,
        visible: true,
      };
    };

    // Загрузка начальной палитры
    onMounted(() => {
      console.log("PaletteGenerator смонтирован");
      generateNewPalette(); // <-- используем переименованный метод

      // Слушаем события уведомлений от дочерних компонентов
      window.addEventListener("show-notification", (event) => {
        showNotification(event.detail.message, event.detail.type);
      });
    });

    // Следим за изменением количества цветов
    watch(colorsCount, (newCount) => {
      if (currentPalette.value.length < newCount) {
        // Добавляем новые цвета
        const colorsToAdd = newCount - currentPalette.value.length;
        for (let i = 0; i < colorsToAdd; i++) {
          const colorValue = generateRandomColor();
          currentPalette.value.push({
            id: Date.now() + i,
            hex: colorValue,
            locked: false,
            rgb: hexToRgbString(colorValue),
            hsl: hexToHslString(colorValue),
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
      // Состояние
      activeTab,
      baseColor,
      paletteType,
      colorsCount,
      colorFormat,
      previewTheme,
      currentPalette,
      currentPaletteName,
      notification,
      tabs,

      // Вычисляемые свойства
      currentPaletteColors,

      // Методы
      generateNewPalette, // <-- возвращаем переименованный метод
      randomizeAll,
      toggleLock,
      copyToClipboard,
      loadPaletteFromLibrary,
    };
  },
};
</script>

<style scoped>
.palette-generator {
  min-height: calc(100vh - 120px);
}

.generator-nav {
  display: flex;
  background: white;
  border-radius: 10px 10px 0 0;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.nav-tab {
  flex: 1;
  padding: 15px 20px;
  background: none;
  border: none;
  border-right: 1px solid #e2e8f0;
  font-size: 16px;
  font-weight: 600;
  color: #718096;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.nav-tab:last-child {
  border-right: none;
}

.nav-tab:hover {
  background-color: #f8f9fa;
  color: #4a5568;
}

.nav-tab.active {
  background-color: #667eea;
  color: white;
  box-shadow: inset 0 -3px 0 rgba(255, 255, 255, 0.5);
}

.tab-content {
  background: white;
  padding: 30px;
  border-radius: 0 0 10px 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  min-height: 600px;
}

.generation-panel {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 30px;
  margin-bottom: 40px;
}

.panel-left,
.panel-right {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.controls-panel {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
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
  font-size: 14px;
}

.control-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  background: white;
  cursor: pointer;
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
  font-size: 13px;
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
  grid-column: 1 / -1;
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.generate-button,
.randomize-button {
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.generate-button {
  background-color: #10b981;
  color: white;
}

.randomize-button {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: white;
}

.generate-button:hover,
.randomize-button:hover {
  transform: translateY(-2px);
}

.palette-display {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 20px;
}

.palette-item {
  min-width: 200px;
}

.preview-section {
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #e2e8f0;
}

.preview-section h3 {
  margin-bottom: 20px;
  color: #333;
}

@media (max-width: 1200px) {
  .generation-panel {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .generator-nav {
    flex-direction: column;
  }

  .nav-tab {
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
  }

  .controls-panel {
    grid-template-columns: 1fr;
  }

  .button-group {
    flex-direction: column;
  }

  .palette-display {
    grid-template-columns: 1fr;
  }

  .palette-item {
    min-width: 100%;
  }
}
</style>
