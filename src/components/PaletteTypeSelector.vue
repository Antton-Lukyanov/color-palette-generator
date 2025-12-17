<template>
  <div class="palette-type-selector">
    <h3>🎨 Тип цветовой палитры</h3>

    <div class="type-grid">
      <div
        v-for="type in paletteTypes"
        :key="type.id"
        @click="selectType(type.id)"
        class="type-card"
        :class="{ active: selectedType === type.id }"
      >
        <div class="type-preview">
          <div
            v-for="color in type.previewColors"
            :key="color"
            class="preview-color"
            :style="{ backgroundColor: color }"
          ></div>
        </div>
        <div class="type-info">
          <h4>{{ type.name }}</h4>
          <p>{{ type.description }}</p>
        </div>
      </div>
    </div>

    <div class="type-description" v-if="selectedTypeInfo">
      <h4>О типе "{{ selectedTypeInfo.name }}":</h4>
      <p>{{ selectedTypeInfo.detailedDescription }}</p>
      <div class="type-tips">
        <p>
          <strong>Используйте для:</strong>
          {{ selectedTypeInfo.useCases.join(", ") }}
        </p>
        <p>
          <strong>Рекомендации:</strong> {{ selectedTypeInfo.recommendations }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";

export default {
  name: "PaletteTypeSelector",

  props: {
    modelValue: {
      type: String,
      default: "analogous",
    },
  },

  emits: ["update:modelValue"],

  setup(props, { emit }) {
    const selectedType = ref(props.modelValue);

    const paletteTypes = [
      {
        id: "analogous",
        name: "Аналогичная",
        description: "Соседние цвета на цветовом круге",
        detailedDescription:
          "Аналогичная палитра создается из цветов, расположенных рядом на цветовом круге. Такие цвета гармонично сочетаются и создают спокойное, уравновешенное впечатление.",
        useCases: ["веб-сайты", "брендинг", "интерфейсы"],
        recommendations: "Идеально для создания мягкого, ненавязчивого дизайна",
        previewColors: ["#667eea", "#5a67d8", "#4c51bf", "#434190", "#3c366b"],
      },
      {
        id: "monochromatic",
        name: "Монохромная",
        description: "Оттенки одного цвета",
        detailedDescription:
          "Монохромная палитра использует различные оттенки, тона и тени одного базового цвета. Создает элегантный и целостный вид.",
        useCases: ["минимализм", "корпоративный стиль", "презентации"],
        recommendations: "Используйте для создания глубины и иерархии",
        previewColors: ["#667eea", "#7e97ea", "#96afea", "#aec7ea", "#c6dfea"],
      },
      {
        id: "triadic",
        name: "Триадная",
        description: "Три равноудаленных цвета",
        detailedDescription:
          "Триадная палитра состоит из трех цветов, равноудаленных на цветовом круге. Обеспечивает высокий контраст при сохранении гармонии.",
        useCases: ["детские проекты", "игры", "креативные сайты"],
        recommendations: "Идеально для привлечения внимания",
        previewColors: ["#667eea", "#ea66a3", "#a3ea66", "#ea6666", "#66eaea"],
      },
      {
        id: "complementary",
        name: "Комплементарная",
        description: "Противоположные цвета",
        detailedDescription:
          "Комплементарная палитра использует цвета, расположенные напротив друг друга на цветовом круге. Максимальный контраст для выделения важных элементов.",
        useCases: ["акции", "выделение CTA", "лэндинги"],
        recommendations:
          "Используйте с осторожностью для избежания визуальной усталости",
        previewColors: ["#667eea", "#ea7d66", "#4c51bf", "#bfa94c", "#3c366b"],
      },
      {
        id: "tetradic",
        name: "Тетрадная",
        description: "Четыре цвета, две комплементарные пары",
        detailedDescription:
          "Тетрадная (прямоугольная) схема использует две пары комплементарных цветов. Обеспечивает богатую цветовую палитру с множеством вариантов.",
        useCases: ["сложные интерфейсы", "игры", "дизайн данных"],
        recommendations: "Используйте один цвет как доминирующий",
        previewColors: ["#667eea", "#ea7d66", "#4c51bf", "#66ea7d", "#3c366b"],
      },
      {
        id: "splitComplementary",
        name: "Расщепленная",
        description: "Базовый цвет + два соседних к комплементарному",
        detailedDescription:
          "Расщепленная комплементарная схема использует базовый цвет и два цвета, соседние с его комплементарным. Меньший контраст, чем у чистой комплементарной.",
        useCases: ["блоги", "портфолио", "образовательные платформы"],
        recommendations: "Более безопасный вариант комплементарной схемы",
        previewColors: ["#667eea", "#ea66a3", "#66ea7d", "#4c51bf", "#3c366b"],
      },
    ];

    const selectedTypeInfo = computed(() => {
      return paletteTypes.find((type) => type.id === selectedType.value);
    });

    const selectType = (typeId) => {
      selectedType.value = typeId;
      emit("update:modelValue", typeId);
    };

    return {
      selectedType,
      paletteTypes,
      selectedTypeInfo,
      selectType,
    };
  },
};
</script>

<style scoped>
.palette-type-selector {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.palette-type-selector h3 {
  margin-bottom: 20px;
  color: #333;
}

.type-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.type-card {
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.type-card:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
}

.type-card.active {
  border-color: #667eea;
  background-color: #f7f9ff;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.type-preview {
  display: flex;
  height: 40px;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 10px;
  border: 1px solid #e2e8f0;
}

.preview-color {
  flex: 1;
}

.type-info h4 {
  margin: 0 0 5px 0;
  color: #2d3748;
  font-size: 16px;
}

.type-info p {
  margin: 0;
  color: #718096;
  font-size: 13px;
  line-height: 1.4;
}

.type-description {
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.type-description h4 {
  margin-top: 0;
  color: #2d3748;
}

.type-description p {
  color: #4a5568;
  line-height: 1.6;
}

.type-tips {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #e2e8f0;
}

.type-tips p {
  margin: 5px 0;
  font-size: 14px;
}

.type-tips strong {
  color: #2d3748;
}

@media (max-width: 768px) {
  .type-grid {
    grid-template-columns: 1fr;
  }
}
</style>
