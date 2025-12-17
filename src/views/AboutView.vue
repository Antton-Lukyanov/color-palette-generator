<template>
  <div class="about-view">
    <div class="view-header">
      <h2>ℹ️ О проекте</h2>
      <p>Генератор цветовых палитр - учебный проект по фронтенд разработке</p>
    </div>

    <div class="about-content">
      <div class="about-section">
        <h3>🎯 Цель проекта</h3>
        <p>
          Данный проект разработан в рамках практических работ №27-28 по
          дисциплине "Фронтенд и бэкенд разработка". Основная цель - освоение
          современных технологий веб-разработки на примере создания
          полнофункционального приложения.
        </p>
      </div>

      <div class="about-section">
        <h3>🚀 Технологии</h3>
        <div class="tech-grid">
          <div class="tech-card">
            <div class="tech-icon">⚡</div>
            <h4>Vue 3</h4>
            <p>Прогрессивный JavaScript фреймворк</p>
          </div>
          <div class="tech-card">
            <div class="tech-icon">🎨</div>
            <h4>Composition API</h4>
            <p>Современный API для организации логики компонентов</p>
          </div>
          <div class="tech-card">
            <div class="tech-icon">🛣️</div>
            <h4>Vue Router</h4>
            <p>Официальный маршрутизатор для Vue.js</p>
          </div>
          <div class="tech-card">
            <div class="tech-icon">📦</div>
            <h4>Vite</h4>
            <p>Современный инструмент сборки</p>
          </div>
        </div>
      </div>

      <div class="about-section">
        <h3>📋 Функциональность</h3>
        <div class="features-list">
          <div class="feature-item">
            <span class="feature-icon">🎨</span>
            <div class="feature-text">
              <h4>Генерация палитр</h4>
              <p>Создание гармоничных цветовых схем различных типов</p>
            </div>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🔍</span>
            <div class="feature-text">
              <h4>Анализ доступности</h4>
              <p>Проверка контрастности по стандартам WCAG 2.1</p>
            </div>
          </div>
          <div class="feature-item">
            <span class="feature-icon">📚</span>
            <div class="feature-text">
              <h4>Библиотека палитр</h4>
              <p>Сохранение и организация цветовых схем</p>
            </div>
          </div>
          <div class="feature-item">
            <span class="feature-icon">📥</span>
            <div class="feature-text">
              <h4>Экспорт в форматы</h4>
              <p>CSS, SCSS, Tailwind, JSON, iOS, Android</p>
            </div>
          </div>
        </div>
      </div>

      <div class="about-section">
        <h3>📖 Руководство пользователя</h3>
        <div class="guide-steps">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h4>Выберите базовый цвет</h4>
              <p>
                Используйте цветовой круг или введите HEX-код на вкладке
                "Генератор"
              </p>
            </div>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h4>Выберите тип палитры</h4>
              <p>
                Аналогичная, монохромная, триадная или другая гармоничная схема
              </p>
            </div>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h4>Проанализируйте доступность</h4>
              <p>Проверьте контрастность цветов на вкладке "Анализатор"</p>
            </div>
          </div>
          <div class="step">
            <div class="step-number">4</div>
            <div class="step-content">
              <h4>Сохраните и экспортируйте</h4>
              <p>
                Сохраните палитру в библиотеке и экспортируйте в нужном формате
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="about-section">
        <h3>📞 Контакты</h3>
        <div class="contact-info">
          <p><strong>Дисциплина:</strong> Фронтенд и бэкенд разработка</p>
          <p><strong>Преподаватель:</strong> Александров Алексей Сергеевич</p>
          <p><strong>Семестр:</strong> 3 семестр, 2025/2026 учебный год</p>
          <p><strong>Институт:</strong> ИПТИП</p>
          <p><strong>Кафедра:</strong> Индустриального программирования</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AboutView",
};
</script>

<style scoped>
.about-view {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
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

.about-content {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.about-section {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.about-section h3 {
  margin-bottom: 20px;
  color: #2d3748;
  font-size: 1.5rem;
  border-bottom: 2px solid #667eea;
  padding-bottom: 10px;
}

.about-section p {
  color: #4a5568;
  line-height: 1.6;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.tech-card {
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.tech-card:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
}

.tech-icon {
  font-size: 2rem;
  margin-bottom: 15px;
}

.tech-card h4 {
  margin-bottom: 10px;
  color: #2d3748;
}

.tech-card p {
  color: #718096;
  font-size: 0.9rem;
  line-height: 1.4;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
}

.feature-item {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.feature-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 8px;
  flex-shrink: 0;
}

.feature-text {
  flex: 1;
}

.feature-text h4 {
  margin-bottom: 5px;
  color: #2d3748;
}

.feature-text p {
  color: #718096;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
}

.guide-steps {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
}

.step {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.step-number {
  width: 40px;
  height: 40px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-content h4 {
  margin-bottom: 8px;
  color: #2d3748;
}

.step-content p {
  color: #718096;
  line-height: 1.5;
  margin: 0;
}

.contact-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
  margin-top: 20px;
}

.contact-info p {
  margin: 0;
  padding: 10px 15px;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 3px solid #667eea;
}

.contact-info strong {
  color: #2d3748;
  margin-right: 5px;
}

@media (max-width: 768px) {
  .about-section {
    padding: 20px;
  }

  .tech-grid {
    grid-template-columns: 1fr;
  }

  .feature-item,
  .step {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }

  .contact-info {
    grid-template-columns: 1fr;
  }
}
</style>
