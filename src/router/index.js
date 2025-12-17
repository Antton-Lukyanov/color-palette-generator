import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AnalyzeView from "../views/AnalyzeView.vue";
import LibraryView from "../views/LibraryView.vue";
import ExportView from "../views/ExportView.vue";
import AboutView from "../views/AboutView.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
    meta: {
      title: "Генератор палитр",
      icon: "🎨",
    },
  },
  {
    path: "/analyze",
    name: "Analyze",
    component: AnalyzeView,
    meta: {
      title: "Анализатор доступности",
      icon: "🔍",
    },
  },
  {
    path: "/library",
    name: "Library",
    component: LibraryView,
    meta: {
      title: "Библиотека палитр",
      icon: "📚",
    },
  },
  {
    path: "/export",
    name: "Export",
    component: ExportView,
    meta: {
      title: "Экспорт палитр",
      icon: "📥",
    },
  },
  {
    path: "/about",
    name: "About",
    component: AboutView,
    meta: {
      title: "О проекте",
      icon: "ℹ️",
    },
  },
  {
    // Редирект с несуществующих путей на главную
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

// Изменение заголовка страницы при навигации
router.beforeEach((to, from, next) => {
  const title = to.meta.title
    ? `Генератор палитр | ${to.meta.title}`
    : "Генератор цветовых палитр";
  document.title = title;
  next();
});

export default router;
