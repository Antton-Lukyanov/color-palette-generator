<template>
  <div id="app">
    <header class="app-header">
      <h1>🎨 Генератор цветовых палитр</h1>
      <p>Создавайте гармоничные цветовые схемы для ваших проектов</p>
    </header>

    <main class="main-content">
      <PaletteGenerator />
    </main>

    <footer class="app-footer">
      <p>Vue 3 + Vite • Практическая работа №27</p>
    </footer>

    <Notification
      :message="notification.message"
      :type="notification.type"
      :visible="notification.visible"
      @close="notification.visible = false"
    />
  </div>
</template>

<script>
import { ref } from "vue";
import PaletteGenerator from "./components/PaletteGenerator.vue";
import Notification from "./components/Notification.vue";

export default {
  name: "App",
  components: {
    PaletteGenerator,
    Notification,
  },
  setup() {
    const notification = ref({
      message: "",
      type: "success",
      visible: false,
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
  background-color: #f5f5f5;
  color: #333;
  line-height: 1.6;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  text-align: center;
}

.app-header h1 {
  margin-bottom: 0.5rem;
  font-size: 2.5rem;
}

.app-header p {
  opacity: 0.9;
  font-size: 1.1rem;
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.app-footer {
  background-color: #333;
  color: white;
  text-align: center;
  padding: 1rem;
  margin-top: auto;
}
</style>
