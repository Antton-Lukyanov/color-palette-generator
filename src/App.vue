<template>
  <div id="app">
    <!-- Шапка приложения -->
    <header class="app-header">
      <div class="header-content">
        <h1>🎨 Генератор цветовых палитр</h1>
        <p class="subtitle">
          Создавайте, анализируйте и экспортируйте гармоничные цветовые схемы
        </p>
      </div>

      <!-- Навигация Vue Router -->
      <nav class="main-nav">
        <router-link
          to="/"
          class="nav-link"
          exact-active-class="router-link-active"
        >
          <span class="nav-icon">🏠</span>
          <span class="nav-text">Генератор</span>
        </router-link>
        <router-link
          to="/analyze"
          class="nav-link"
          active-class="router-link-active"
        >
          <span class="nav-icon">🔍</span>
          <span class="nav-text">Анализатор</span>
        </router-link>
        <router-link
          to="/library"
          class="nav-link"
          active-class="router-link-active"
        >
          <span class="nav-icon">📚</span>
          <span class="nav-text">Библиотека</span>
        </router-link>
        <router-link
          to="/export"
          class="nav-link"
          active-class="router-link-active"
        >
          <span class="nav-icon">📥</span>
          <span class="nav-text">Экспорт</span>
        </router-link>
        <router-link
          to="/about"
          class="nav-link"
          active-class="router-link-active"
        >
          <span class="nav-icon">ℹ️</span>
          <span class="nav-text">О проекте</span>
        </router-link>
      </nav>
    </header>

    <!-- Основное содержимое с Vue Router -->
    <main class="main-content">
      <router-view></router-view>
    </main>

    <!-- Подвал -->
    <footer class="app-footer">
      <div class="footer-content">
        <div class="footer-section">
          <h4>Генератор цветовых палитр</h4>
          <p>Vue 3 + Vite • Практические работы №27-28</p>
        </div>
        <div class="footer-section">
          <p>Фронтенд и бэкенд разработка</p>
          <p>Семестр 1 • 2025/2026 уч. год</p>
        </div>
        <div class="footer-section">
          <p>Функции: генерация, анализ доступности, библиотека, экспорт</p>
          <p class="footer-note">Проект создан для учебных целей</p>
        </div>
      </div>
    </footer>

    <!-- Компонент уведомлений -->
    <Notification
      :message="notification.message"
      :type="notification.type"
      :visible="notification.visible"
      @close="notification.visible = false"
    />
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Notification from "./components/Notification.vue";

export default {
  name: "App",

  components: {
    Notification,
  },

  setup() {
    const router = useRouter();
    const notification = ref({
      message: "",
      type: "success",
      visible: false,
    });

    // Принудительно проверяем роутер
    console.log("App mounted, router:", router);
    console.log("Current route:", router.currentRoute.value);

    // Слушаем события уведомлений
    onMounted(() => {
      window.addEventListener("show-notification", (event) => {
        notification.value = {
          message: event.detail.message,
          type: event.detail.type,
          visible: true,
        };
      });

      // Добавляем глобальный обработчик кликов для отладки
      document.addEventListener("click", (e) => {
        if (e.target.closest(".nav-link")) {
          console.log(
            "Навигация кликнута:",
            e.target.closest(".nav-link").getAttribute("to")
          );
        }
      });
    });

    return {
      notification,
    };
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f0f9f0;
  color: #1a3c34;
  line-height: 1.6;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Шапка - изумрудный цвет */
.app-header {
  background-color: #10b981;
  color: white;
  padding: 2rem 2rem 0 2rem;
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.2);
}

.header-content {
  text-align: center;
  margin-bottom: 2rem;
}

.header-content h1 {
  margin-bottom: 0.5rem;
  font-size: 2.5rem;
  font-weight: 700;
}

.subtitle {
  opacity: 0.95;
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
}

/* Основная навигация - ВАЖНО: принудительно включаем клики */
.main-nav {
  display: flex;
  justify-content: center;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 15px 15px 0 0;
  overflow: hidden;
}

.nav-link {
  flex: 1;
  padding: 1rem 1.5rem;
  color: white;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  position: relative;
  min-width: 100px;
  cursor: pointer !important;
  pointer-events: auto !important;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.25) !important;
}

.nav-link.router-link-active {
  background: rgba(255, 255, 255, 0.3) !important;
  font-weight: 600;
}

.nav-link.router-link-active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: white;
}

.nav-icon {
  font-size: 1.5rem;
}

.nav-text {
  font-size: 0.9rem;
  white-space: nowrap;
}

/* Основное содержимое */
.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

/* Подвал */
.app-footer {
  background-color: #1a3c34;
  color: #a7f3d0;
  padding: 2rem;
  margin-top: auto;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.footer-section h4 {
  color: white;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.footer-section p {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  line-height: 1.5;
}

.footer-note {
  font-size: 0.8rem;
  color: #86efac;
  font-style: italic;
}

/* Адаптивность */
@media (max-width: 768px) {
  .header-content h1 {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .main-nav {
    flex-wrap: wrap;
  }

  .nav-link {
    flex: 1 0 33.333%;
    padding: 0.75rem 0.5rem;
  }

  .nav-icon {
    font-size: 1.25rem;
  }

  .nav-text {
    font-size: 0.8rem;
  }

  .main-content {
    padding: 1rem;
  }

  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .app-header {
    padding: 1.5rem 1rem 0 1rem;
  }

  .nav-link {
    flex: 1 0 50%;
  }

  .nav-text {
    display: none;
  }

  .nav-link.router-link-active .nav-text {
    display: block;
    position: absolute;
    top: -25px;
    background: white;
    color: #10b981;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 0.7rem;
    font-weight: 600;
  }
}

/* Принудительное включение кликов для роутер-линков */
a[href^="/"],
.nav-link,
[routerlink],
[to] {
  cursor: pointer !important;
  pointer-events: auto !important;
  touch-action: manipulation;
}

/* Отключаем любые возможные перекрытия */
.main-nav * {
  pointer-events: auto !important;
}
</style>
