<template>
  <div class="export-view">
    <div class="view-header">
      <h2>📥 Экспорт цветовых палитр</h2>
      <p>
        Экспортируйте ваши палитры в различные форматы для использования в
        проектах
      </p>
    </div>

    <div class="export-content">
      <div class="export-left">
        <h3>🔄 Импорт палитры</h3>
        <div class="import-options">
          <div class="import-option">
            <h4>Из библиотеки</h4>
            <p>Выберите палитру из сохраненных в библиотеке</p>
            <router-link to="/library" class="import-btn">
              📚 Открыть библиотеку
            </router-link>
          </div>

          <div class="import-option">
            <h4>Из генератора</h4>
            <p>Создайте новую палитру в генераторе</p>
            <router-link to="/" class="import-btn">
              🎨 Перейти к генератору
            </router-link>
          </div>

          <div class="import-option">
            <h4>Вставить HEX коды</h4>
            <p>Вставьте список цветов через запятую</p>
            <div class="import-input">
              <input
                v-model="hexInput"
                placeholder="#FF5733, #33FF57, #3357FF"
                class="hex-import"
                type="text"
              />
              <button @click="importFromHex" class="import-hex-btn">
                Импорт
              </button>
            </div>
          </div>
        </div>

        <div class="current-palette" v-if="currentColors.length > 0">
          <h4>Текущая палитра:</h4>
          <div class="palette-preview">
            <div
              v-for="color in currentColors"
              :key="color"
              class="preview-color"
              :style="{ backgroundColor: color }"
              :title="color"
            ></div>
          </div>
          <p class="colors-count">{{ currentColors.length }} цветов</p>
        </div>
      </div>

      <div class="export-right">
        <ExportPanel :colors="exportColors" :palette-name="paletteName" />
      </div>
    </div>

    <div class="export-formats-info">
      <h3>📋 Поддерживаемые форматы</h3>
      <div class="formats-grid">
        <div class="format-info">
          <div class="format-icon">🎨</div>
          <h4>CSS Variables</h4>
          <p>Современные CSS custom properties для веб-разработки</p>
          <span class="format-tag">.css</span>
        </div>
        <div class="format-info">
          <div class="format-icon">⚡</div>
          <h4>SCSS/SASS</h4>
          <p>Переменные для препроцессоров Sass и SCSS</p>
          <span class="format-tag">.scss</span>
        </div>
        <div class="format-info">
          <div class="format-icon">🌊</div>
          <h4>Tailwind CSS</h4>
          <p>Конфигурация для расширения цветовой палитры Tailwind</p>
          <span class="format-tag">.js</span>
        </div>
        <div class="format-info">
          <div class="format-icon">📊</div>
          <h4>JSON</h4>
          <p>Универсальный формат для обмена данными</p>
          <span class="format-tag">.json</span>
        </div>
        <div class="format-info">
          <div class="format-icon">📱</div>
          <h4>iOS / SwiftUI</h4>
          <p>Расширение Color для использования в SwiftUI</p>
          <span class="format-tag">.swift</span>
        </div>
        <div class="format-info">
          <div class="format-icon">🤖</div>
          <h4>Android / XML</h4>
          <p>Ресурсы цветов для Android приложений</p>
          <span class="format-tag">.xml</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import ExportPanel from "../components/ExportPanel.vue";

export default {
  name: "ExportView",

  components: {
    ExportPanel,
  },

  setup() {
    const currentColors = ref([
      "#667eea",
      "#764ba2",
      "#f093fb",
      "#f5576c",
      "#4facfe",
    ]);
    const hexInput = ref("");
    const paletteName = ref("Экспортная палитра");

    const exportColors = computed(() => {
      return currentColors.value.map((color) => ({ hex: color }));
    });

    const importFromHex = () => {
      if (!hexInput.value.trim()) return;

      const colors = hexInput.value
        .split(",")
        .map((color) => color.trim())
        .filter((color) => /^#[0-9A-F]{6}$/i.test(color))
        .map((color) => color.toUpperCase());

      if (colors.length > 0) {
        currentColors.value = colors;
        hexInput.value = "";

        const event = new CustomEvent("show-notification", {
          detail: {
            message: `Импортировано ${colors.length} цветов`,
            type: "success",
          },
        });
        window.dispatchEvent(event);
      } else {
        const event = new CustomEvent("show-notification", {
          detail: {
            message: "Не найдено валидных HEX цветов",
            type: "error",
          },
        });
        window.dispatchEvent(event);
      }
    };

    return {
      currentColors,
      hexInput,
      paletteName,
      exportColors,
      importFromHex,
    };
  },
};
</script>

<style scoped>
.export-view {
  padding: 20px;
}

.view-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
  border-radius: 15px;
}

.view-header h2 {
  margin-bottom: 10px;
  color: #2d3748;
  font-size: 2rem;
}

.view-header p {
  color: #4a5568;
  max-width: 600px;
  margin: 0 auto;
  font-size: 1.1rem;
  line-height: 1.6;
}

.export-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 30px;
  margin-bottom: 40px;
}

.export-left {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.export-left h3 {
  margin-bottom: 20px;
  color: #2d3748;
}

.import-options {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
}

.import-option {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.import-option h4 {
  margin-bottom: 8px;
  color: #2d3748;
}

.import-option p {
  color: #718096;
  margin-bottom: 15px;
  font-size: 0.9rem;
  line-height: 1.4;
}

.import-btn {
  display: inline-block;
  padding: 10px 20px;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.import-btn:hover {
  background: #5a67d8;
  transform: translateY(-1px);
}

.import-input {
  display: flex;
  gap: 10px;
}

.hex-import {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-family: "Courier New", monospace;
  font-size: 0.9rem;
}

.import-hex-btn {
  padding: 10px 20px;
  background: #48bb78;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.import-hex-btn:hover {
  background: #38a169;
}

.current-palette {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.current-palette h4 {
  margin-bottom: 15px;
  color: #2d3748;
}

.palette-preview {
  display: flex;
  height: 40px;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 10px;
  border: 1px solid #e2e8f0;
}

.preview-color {
  flex: 1;
}

.colors-count {
  text-align: center;
  color: #718096;
  font-size: 0.9rem;
}

.export-right {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.export-formats-info {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.export-formats-info h3 {
  margin-bottom: 25px;
  text-align: center;
  color: #2d3748;
}

.formats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.format-info {
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.format-info:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
}

.format-icon {
  font-size: 2rem;
  margin-bottom: 15px;
}

.format-info h4 {
  margin-bottom: 10px;
  color: #2d3748;
}

.format-info p {
  color: #718096;
  font-size: 0.85rem;
  line-height: 1.4;
  margin-bottom: 15px;
}

.format-tag {
  display: inline-block;
  padding: 4px 8px;
  background: #667eea;
  color: white;
  border-radius: 4px;
  font-size: 0.75rem;
  font-family: "Courier New", monospace;
}

@media (max-width: 992px) {
  .export-content {
    grid-template-columns: 1fr;
  }

  .formats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .formats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
