<template>
  <div class="color-analyzer">
    <h3>🔍 Анализ доступности</h3>

    <div class="analyzer-controls">
      <div class="control-group">
        <label>Размер текста:</label>
        <select v-model="textSize" class="control-select">
          <option value="normal">Обычный (≥16px)</option>
          <option value="large">
            Крупный (≥18px жирный или ≥24px обычный)
          </option>
        </select>
      </div>

      <div class="control-group">
        <label>Минимальный контраст:</label>
        <select v-model="minContrast" class="control-select">
          <option value="3.0">3.0 (AA Large)</option>
          <option value="4.5">4.5 (AA)</option>
          <option value="7.0">7.0 (AAA)</option>
        </select>
      </div>
    </div>

    <div class="accessibility-results">
      <h4>Результаты проверки контраста:</h4>

      <div v-if="analysisResults.length === 0" class="no-results">
        <p>Добавьте цвета для анализа</p>
      </div>

      <div v-else class="results-grid">
        <div
          v-for="(result, index) in analysisResults"
          :key="index"
          class="result-card"
          :style="{ borderLeftColor: result.levelColor }"
        >
          <div class="color-pair">
            <div
              class="color-sample"
              :style="{ backgroundColor: result.color1 }"
              :title="result.color1"
            ></div>
            <span class="vs">vs</span>
            <div
              class="color-sample"
              :style="{ backgroundColor: result.color2 }"
              :title="result.color2"
            ></div>
          </div>

          <div class="result-details">
            <div class="contrast-score">
              <strong>Контраст:</strong> {{ result.contrast }}:1
            </div>
            <div class="accessibility-level">
              <span
                class="level-badge"
                :style="{ backgroundColor: result.levelColor }"
              >
                {{ result.level }}
              </span>
              <span class="level-text">{{ result.score }}</span>
            </div>

            <div class="result-status">
              <span
                class="status-icon"
                :class="{ pass: result.isReadable, fail: !result.isReadable }"
              >
                {{ result.isReadable ? "✓" : "✗" }}
              </span>
              <span class="status-text">
                {{ result.isReadable ? "Текст читаем" : "Текст нечитаем" }}
              </span>
            </div>

            <div v-if="!result.isReadable" class="suggestions">
              <p><strong>Рекомендации:</strong></p>
              <ul>
                <li>Используйте более контрастную пару цветов</li>
                <li>Увеличьте размер текста</li>
                <li>Измените насыщенность одного из цветов</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="accessibility-summary" v-if="analysisResults.length > 0">
      <h4>Общая статистика:</h4>
      <div class="summary-stats">
        <div class="stat-item">
          <div class="stat-value">{{ readablePairs }}</div>
          <div class="stat-label">Читаемых пар</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ totalPairs }}</div>
          <div class="stat-label">Всего пар</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ accessibilityScore }}%</div>
          <div class="stat-label">Доступность</div>
        </div>
      </div>

      <div class="summary-message" :class="summaryClass">
        {{ summaryMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";
import {
  analyzePaletteAccessibility,
  getAccessibilityLevel,
  isTextReadable,
} from "../composables/useColorAnalysis";

export default {
  name: "ColorAnalyzer",

  props: {
    colors: {
      type: Array,
      default: () => [],
    },
  },

  setup(props) {
    const textSize = ref("normal");
    const minContrast = ref("4.5");

    const analysisResults = computed(() => {
      if (!props.colors || props.colors.length < 2) return [];

      const analysis = analyzePaletteAccessibility(props.colors);

      return analysis.map((result) => {
        const level = getAccessibilityLevel(parseFloat(result.contrast));
        const isReadable =
          parseFloat(result.contrast) >= parseFloat(minContrast.value);

        return {
          ...result,
          level: level.level,
          score: level.score,
          levelColor: level.color,
          isReadable,
        };
      });
    });

    const totalPairs = computed(() => {
      return analysisResults.value.length;
    });

    const readablePairs = computed(() => {
      return analysisResults.value.filter((result) => result.isReadable).length;
    });

    const accessibilityScore = computed(() => {
      if (totalPairs.value === 0) return 0;
      return Math.round((readablePairs.value / totalPairs.value) * 100);
    });

    const summaryMessage = computed(() => {
      const score = accessibilityScore.value;

      if (score === 100) {
        return "Отличная доступность! Все цветовые пары соответствуют стандартам WCAG.";
      } else if (score >= 80) {
        return "Хорошая доступность. Большинство пар цветов читаемы.";
      } else if (score >= 50) {
        return "Удовлетворительная доступность. Рекомендуется улучшить некоторые цветовые сочетания.";
      } else {
        return "Низкая доступность. Многие цветовые пары не соответствуют стандартам контраста.";
      }
    });

    const summaryClass = computed(() => {
      const score = accessibilityScore.value;

      if (score === 100) return "excellent";
      if (score >= 80) return "good";
      if (score >= 50) return "fair";
      return "poor";
    });

    return {
      textSize,
      minContrast,
      analysisResults,
      totalPairs,
      readablePairs,
      accessibilityScore,
      summaryMessage,
      summaryClass,
    };
  },
};
</script>

<style scoped>
.color-analyzer {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.color-analyzer h3 {
  margin-bottom: 20px;
  color: #333;
}

.analyzer-controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e2e8f0;
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

.accessibility-results h4 {
  margin-bottom: 15px;
  color: #2d3748;
}

.no-results {
  text-align: center;
  padding: 40px 20px;
  color: #a0aec0;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 2px dashed #e2e8f0;
}

.results-grid {
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 10px;
}

.result-card {
  padding: 15px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  border-left-width: 4px;
  background: white;
  display: flex;
  gap: 20px;
  align-items: center;
}

.color-pair {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-shrink: 0;
}

.color-sample {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.vs {
  color: #a0aec0;
  font-weight: 600;
  font-size: 12px;
}

.result-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.contrast-score {
  font-size: 14px;
  color: #4a5568;
}

.contrast-score strong {
  color: #2d3748;
}

.accessibility-level {
  display: flex;
  align-items: center;
  gap: 10px;
}

.level-badge {
  padding: 4px 8px;
  border-radius: 4px;
  color: white;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.level-text {
  font-size: 13px;
  color: #4a5568;
}

.result-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 12px;
}

.status-icon.pass {
  background-color: #d4edda;
  color: #155724;
}

.status-icon.fail {
  background-color: #f8d7da;
  color: #721c24;
}

.status-text {
  font-size: 13px;
  color: #4a5568;
}

.suggestions {
  margin-top: 10px;
  padding: 10px;
  background-color: #fff3cd;
  border-radius: 5px;
  border-left: 3px solid #ffc107;
}

.suggestions p {
  margin: 0 0 5px 0;
  font-size: 12px;
  color: #856404;
}

.suggestions ul {
  margin: 0;
  padding-left: 20px;
}

.suggestions li {
  font-size: 12px;
  color: #856404;
  margin-bottom: 3px;
}

.accessibility-summary {
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.accessibility-summary h4 {
  margin-bottom: 15px;
  color: #2d3748;
}

.summary-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

.stat-item {
  text-align: center;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 12px;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.summary-message {
  padding: 15px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.5;
}

.summary-message.excellent {
  background-color: #d4edda;
  color: #155724;
  border-left: 4px solid #28a745;
}

.summary-message.good {
  background-color: #d1ecf1;
  color: #0c5460;
  border-left: 4px solid #17a2b8;
}

.summary-message.fair {
  background-color: #fff3cd;
  color: #856404;
  border-left: 4px solid #ffc107;
}

.summary-message.poor {
  background-color: #f8d7da;
  color: #721c24;
  border-left: 4px solid #dc3545;
}

@media (max-width: 768px) {
  .result-card {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }

  .color-pair {
    justify-content: center;
  }

  .summary-stats {
    grid-template-columns: 1fr;
  }
}
</style>
