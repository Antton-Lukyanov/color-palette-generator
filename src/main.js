import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./style.css";

console.log("🚀 Запуск Vue приложения...");

// Проверяем все импорты
console.log("App компонент:", App);
console.log("Router:", router);

try {
  const app = createApp(App);

  // Добавляем глобальный миксин для отладки
  app.mixin({
    mounted() {
      console.log(
        `📦 Компонент ${this.$options.name || "Anonymous"} смонтирован`
      );
    },
  });

  app.use(router);

  // Добавляем глобальное свойство для отладки
  app.config.globalProperties.$log = (...args) => console.log(...args);

  app.mount("#app");

  console.log("✅ Приложение смонтировано");

  // Проверяем роутер
  console.log("Текущий маршрут:", router.currentRoute.value);
  console.log("Доступные маршруты:", router.getRoutes());

  // Логируем все переходы
  router.beforeEach((to, from, next) => {
    console.log(`🔄 Навигация: ${from.path} → ${to.path}`);
    next();
  });
} catch (error) {
  console.error("❌ Ошибка при загрузке Vue:", error);

  // Показываем ошибку пользователю
  const appEl = document.getElementById("app");
  if (appEl) {
    appEl.innerHTML = `
      <div style="
        padding: 40px;
        text-align: center;
        color: #dc2626;
        font-family: sans-serif;
      ">
        <h2>Ошибка загрузки приложения</h2>
        <p>${error.message}</p>
        <p style="margin-top: 20px; color: #666;">
          Откройте консоль (F12) для подробностей
        </p>
        <button onclick="location.reload()" style="
          margin-top: 20px;
          padding: 10px 20px;
          background: #10b981;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        ">
          Перезагрузить
        </button>
      </div>
    `;
  }
}

// Глобальный обработчик ошибок
window.onerror = function (message, source, lineno, colno, error) {
  console.error("🌍 Глобальная ошибка:", {
    message,
    source,
    lineno,
    colno,
    error,
  });
  return false;
};
