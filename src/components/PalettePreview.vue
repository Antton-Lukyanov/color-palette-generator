<template>
  <div class="palette-preview" :class="theme">
    <div class="mockup-header">
      <h3 :style="{ color: primaryColor }">Заголовок страницы</h3>
      <nav class="mockup-nav">
        <a
          v-for="(item, index) in ['Главная', 'О нас', 'Услуги', 'Контакты']"
          :key="index"
          :style="{ color: textColor }"
        >
          {{ item }}
        </a>
      </nav>
    </div>

    <div class="mockup-content">
      <div class="content-card" :style="{ backgroundColor: cardColor }">
        <h4 :style="{ color: primaryColor }">Карточка продукта</h4>
        <p :style="{ color: textColor }">
          Описание продукта или услуги с демонстрацией цветовой палитры.
        </p>
        <button
          class="mockup-button"
          :style="{
            backgroundColor: accentColor,
            color: buttonTextColor,
          }"
        >
          Подробнее
        </button>
      </div>

      <div class="feature-list">
        <div
          v-for="i in 3"
          :key="i"
          class="feature-item"
          :style="{ borderLeftColor: accentColor }"
        >
          <span :style="{ color: textColor }">Преимущество {{ i }}</span>
        </div>
      </div>
    </div>

    <div class="mockup-footer" :style="{ backgroundColor: footerColor }">
      <p :style="{ color: textColor }">
        © 2024 Ваша компания. Все права защищены.
      </p>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import {
  getColorBrightness,
  adjustColorBrightness,
} from "../composables/useColorUtils";

export default {
  name: "PalettePreview",
  props: {
    colors: {
      type: Array,
      required: true,
    },
    theme: {
      type: String,
      default: "light",
      validator: (value) => ["light", "dark"].includes(value),
    },
  },
  setup(props) {
    // Вычисляемые цвета для превью
    const primaryColor = computed(() => props.colors[0]?.hex || "#667eea");
    const accentColor = computed(() => props.colors[1]?.hex || "#764ba2");
    const cardColor = computed(() =>
      props.theme === "dark" ? "#2d3748" : "#ffffff"
    );
    const footerColor = computed(() =>
      props.theme === "dark" ? "#1a202c" : "#f7fafc"
    );

    // Текст и кнопка автоматически адаптируются под яркость фона
    const textColor = computed(() => {
      const brightness = getColorBrightness(cardColor.value);
      return brightness > 0.5 ? "#2d3748" : "#f7fafc";
    });

    const buttonTextColor = computed(() => {
      const brightness = getColorBrightness(accentColor.value);
      return brightness > 0.5 ? "#2d3748" : "#ffffff";
    });

    return {
      primaryColor,
      accentColor,
      cardColor,
      footerColor,
      textColor,
      buttonTextColor,
    };
  },
};
</script>

<style scoped>
.palette-preview {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.palette-preview.light {
  background-color: #ffffff;
}

.palette-preview.dark {
  background-color: #1a202c;
}

.mockup-header {
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.mockup-header h3 {
  margin-bottom: 15px;
  font-size: 24px;
}

.mockup-nav {
  display: flex;
  gap: 20px;
}

.mockup-nav a {
  text-decoration: none;
  cursor: pointer;
  font-size: 14px;
}

.mockup-nav a:hover {
  text-decoration: underline;
}

.mockup-content {
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.content-card {
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.content-card h4 {
  margin-bottom: 10px;
  font-size: 18px;
}

.content-card p {
  margin-bottom: 15px;
  font-size: 14px;
  line-height: 1.5;
}

.mockup-button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.mockup-button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.feature-item {
  padding: 10px 15px;
  border-left: 3px solid;
  font-size: 14px;
}

.mockup-footer {
  padding: 15px 20px;
  text-align: center;
  border-top: 1px solid #e2e8f0;
}

.mockup-footer p {
  font-size: 12px;
  margin: 0;
}

@media (max-width: 768px) {
  .mockup-content {
    grid-template-columns: 1fr;
  }
}
</style>
