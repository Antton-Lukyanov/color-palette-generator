<template>
  <div class="analyze-view">
    <div class="view-header">
      <h2>🔍 Анализатор доступности цветов</h2>
      <p>
        Проверяйте контрастность цветовых пар на соответствие стандартам WCAG
      </p>
    </div>

    <div class="analyze-content">
      <div class="content-left">
        <h3>📊 Загрузите палитру для анализа</h3>
        <p>Или перейдите в генератор чтобы создать новую палитру</p>
        <router-link to="/" class="go-to-generator">
          🎨 Перейти к генератору
        </router-link>

        <div class="palette-input">
          <h4>Быстрая загрузка:</h4>
          <div class="quick-palettes">
            <button
              v-for="palette in samplePalettes"
              :key="palette.name"
              @click="loadSamplePalette(palette)"
              class="quick-palette-btn"
            >
              <div class="palette-colors">
                <div
                  v-for="color in palette.colors"
                  :key="color"
                  class="color-chip"
                  :style="{ backgroundColor: color }"
                ></div>
              </div>
              <span class="palette-name">{{ palette.name }}</span>
            </button>
          </div>
        </div>
      </div>

      <div class="content-right">
        <ColorAnalyzer :colors="currentPalette" />
      </div>
    </div>

    <div class="wcag-info">
      <h3>📖 О стандарте WCAG 2.1</h3>
      <div class="wcag-grid">
        <div class="wcag-card">
          <div class="wcag-level aaa">
            <span>AAA</span>
          </div>
          <h4>Уровень AAA</h4>
          <p>Контраст 7:1 и выше. Рекомендуется для текста любого размера.</p>
        </div>
        <div class="wcag-card">
          <div class="wcag-level aa">
            <span>AA</span>
          </div>
          <h4>Уровень AA</h4>
          <p>Контраст 4.5:1 для обычного текста, 3:1 для крупного текста.</p>
        </div>
        <div class="wcag-card">
          <div class="wcag-level a-large">
            <span>AA Large</span>
          </div>
          <h4>Уровень AA Large</h4>
          <p>
            Контраст 3:1 для обычного текста. Для текста от 18px или 14px
            жирного.
          </p>
        </div>
        <div class="wcag-card">
          <div class="wcag-level fail">
            <span>Fail</span>
          </div>
          <h4>Недостаточно</h4>
          <p>
            Контраст ниже 3:1. Текст может быть нечитаем для некоторых
            пользователей.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import ColorAnalyzer from "../components/ColorAnalyzer.vue";

export default {
  name: "AnalyzeView",

  components: {
    ColorAnalyzer,
  },

  setup() {
    const currentPalette = ref([]);

    const samplePalettes = [
      {
        name: "Океан",
        colors: ["#1a2980", "#26d0ce", "#4facfe", "#00f2fe", "#667eea"],
      },
      {
        name: "Закат",
        colors: ["#ff7e5f", "#feb47b", "#ff6b6b", "#ee9ca7", "#ffdde1"],
      },
      {
        name: "Лес",
        colors: ["#134e5e", "#71b280", "#43e97b", "#38f9d7", "#a8edea"],
      },
      {
        name: "Песок",
        colors: ["#3a1c71", "#d76d77", "#ffaf7b", "#f7d9aa", "#fef9d7"],
      },
    ];

    const loadSamplePalette = (palette) => {
      currentPalette.value = palette.colors;
    };

    return {
      currentPalette,
      samplePalettes,
      loadSamplePalette,
    };
  },
};
</script>

<style scoped>
.analyze-view {
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

.analyze-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 30px;
  margin-bottom: 40px;
}

.content-left {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.content-left h3 {
  margin-bottom: 10px;
  color: #2d3748;
}

.content-left p {
  color: #718096;
  margin-bottom: 20px;
  line-height: 1.5;
}

.go-to-generator {
  display: inline-block;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  margin-bottom: 30px;
  transition: transform 0.2s ease;
}

.go-to-generator:hover {
  transform: translateY(-2px);
}

.palette-input h4 {
  margin-bottom: 15px;
  color: #2d3748;
}

.quick-palettes {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.quick-palette-btn {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.quick-palette-btn:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
}

.palette-colors {
  display: flex;
  height: 30px;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 10px;
  border: 1px solid #e2e8f0;
}

.color-chip {
  flex: 1;
}

.palette-name {
  font-weight: 600;
  color: #2d3748;
}

.content-right {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.wcag-info {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.wcag-info h3 {
  margin-bottom: 25px;
  text-align: center;
  color: #2d3748;
}

.wcag-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.wcag-card {
  text-align: center;
  padding: 20px;
  border-radius: 8px;
  background: #f8f9fa;
  border: 1px solid #e2e8f0;
}

.wcag-level {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  font-weight: bold;
  color: white;
  font-size: 14px;
}

.wcag-level.aaa {
  background-color: #28a745;
}

.wcag-level.aa {
  background-color: #17a2b8;
}

.wcag-level.a-large {
  background-color: #ffc107;
  color: #000;
}

.wcag-level.fail {
  background-color: #dc3545;
}

.wcag-card h4 {
  margin-bottom: 10px;
  color: #2d3748;
}

.wcag-card p {
  color: #718096;
  font-size: 0.9rem;
  line-height: 1.4;
}

@media (max-width: 992px) {
  .analyze-content {
    grid-template-columns: 1fr;
  }

  .wcag-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .wcag-grid {
    grid-template-columns: 1fr;
  }
}
</style>
