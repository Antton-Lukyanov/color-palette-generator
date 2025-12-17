<template>
  <div class="library-view">
    <div class="view-header">
      <h2>📚 Библиотека цветовых палитр</h2>
      <p>Сохраняйте, организовывайте и управляйте вашими цветовыми палитрами</p>
    </div>

    <PaletteLibrary :current-colors="currentColors" />

    <div class="library-stats">
      <h3>📊 Статистика библиотеки</h3>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">{{ totalPalettes }}</div>
          <div class="stat-label">Всего палитр</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ favoritePalettes }}</div>
          <div class="stat-label">В избранном</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ averageColors }}</div>
          <div class="stat-label">Среднее цветов</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ uniqueTags }}</div>
          <div class="stat-label">Уникальных тегов</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import PaletteLibrary from "../components/PaletteLibrary.vue";

export default {
  name: "LibraryView",

  components: {
    PaletteLibrary,
  },

  setup() {
    const currentColors = ref([]);

    // Статистика (заглушки)
    const totalPalettes = ref(12);
    const favoritePalettes = ref(4);
    const averageColors = ref(5);
    const uniqueTags = ref(8);

    // Загрузка статистики
    onMounted(() => {
      // В реальном приложении здесь была бы загрузка из localStorage или API
      const saved = localStorage.getItem("paletteLibrary");
      if (saved) {
        const palettes = JSON.parse(saved);
        totalPalettes.value = palettes.length;
        favoritePalettes.value = palettes.filter((p) => p.favorite).length;

        const totalColors = palettes.reduce(
          (sum, p) => sum + p.colors.length,
          0
        );
        averageColors.value = Math.round(totalColors / palettes.length);

        const allTags = new Set();
        palettes.forEach((p) => p.tags.forEach((tag) => allTags.add(tag)));
        uniqueTags.value = allTags.size;
      }
    });

    return {
      currentColors,
      totalPalettes,
      favoritePalettes,
      averageColors,
      uniqueTags,
    };
  },
};
</script>

<style scoped>
.library-view {
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

.library-stats {
  margin-top: 40px;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.library-stats h3 {
  margin-bottom: 25px;
  text-align: center;
  color: #2d3748;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  text-align: center;
  padding: 25px;
  background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
  border-radius: 10px;
  border: 1px solid #667eea30;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 10px;
}

.stat-label {
  font-size: 0.9rem;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
