<template>
  <div class="home-view">
    <div class="view-header">
      <h2>🎨 Генератор цветовых палитр</h2>
      <p>
        Создавайте гармоничные цветовые схемы на основе выбранного цвета и типа
        палитры
      </p>
    </div>

    <PaletteGenerator />

    <div class="quick-tips">
      <h3>💡 Советы по использованию:</h3>
      <div class="tips-grid">
        <div class="tip-card">
          <div class="tip-icon">🎯</div>
          <h4>Выберите базовый цвет</h4>
          <p>
            Используйте цветовой круг или введите HEX-код для выбора основного
            цвета
          </p>
        </div>
        <div class="tip-card">
          <div class="tip-icon">🌈</div>
          <h4>Выберите тип палитры</h4>
          <p>
            Аналогичная, монохромная, триадная и другие типы гармоничных палитр
          </p>
        </div>
        <div class="tip-card">
          <div class="tip-icon">🔒</div>
          <h4>Закрепляйте цвета</h4>
          <p>
            Нажмите на замок чтобы сохранить понравившиеся цвета при генерации
          </p>
        </div>
        <div class="tip-card">
          <div class="tip-icon">💾</div>
          <h4>Сохраняйте в библиотеку</h4>
          <p>Сохраняйте палитры для последующего использования и экспорта</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PaletteGenerator from "../components/PaletteGenerator.vue";

export default {
  name: "HomeView",

  components: {
    PaletteGenerator,
  },
};
</script>

<style scoped>
.home-view {
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

.quick-tips {
  margin-top: 60px;
  padding-top: 40px;
  border-top: 1px solid #e2e8f0;
}

.quick-tips h3 {
  margin-bottom: 30px;
  text-align: center;
  color: #2d3748;
  font-size: 1.5rem;
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
}

.tip-card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  text-align: center;
}

.tip-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
  border-color: #667eea;
}

.tip-icon {
  font-size: 2.5rem;
  margin-bottom: 15px;
}

.tip-card h4 {
  margin-bottom: 10px;
  color: #2d3748;
  font-size: 1.2rem;
}

.tip-card p {
  color: #718096;
  line-height: 1.5;
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .view-header h2 {
    font-size: 1.5rem;
  }

  .view-header p {
    font-size: 1rem;
  }

  .tips-grid {
    grid-template-columns: 1fr;
  }
}
</style>
