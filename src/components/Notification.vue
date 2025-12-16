<template>
  <div v-if="visible" class="notification" :class="type" @click="close">
    <div class="notification-content">
      <span class="notification-message">{{ message }}</span>
      <button class="notification-close" @click.stop="close">×</button>
    </div>
  </div>
</template>

<script>
import { onMounted, onUnmounted } from "vue";

export default {
  name: "Notification",
  props: {
    message: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "info",
      validator: (value) =>
        ["success", "error", "info", "warning"].includes(value),
    },
    visible: {
      type: Boolean,
      default: false,
    },
    duration: {
      type: Number,
      default: 3000,
    },
  },
  emits: ["close"],
  setup(props, { emit }) {
    // Автоматическое закрытие уведомления
    let timeoutId = null;

    const close = () => {
      emit("close");
    };

    onMounted(() => {
      if (props.visible && props.duration > 0) {
        timeoutId = setTimeout(close, props.duration);
      }
    });

    onUnmounted(() => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    });

    return {
      close,
    };
  },
};
</script>

<style scoped>
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  min-width: 300px;
  max-width: 400px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.notification.success {
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
}

.notification.error {
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
}

.notification.info {
  background-color: #d1ecf1;
  border: 1px solid #bee5eb;
  color: #0c5460;
}

.notification.warning {
  background-color: #fff3cd;
  border: 1px solid #ffeaa7;
  color: #856404;
}

.notification-content {
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notification-message {
  flex: 1;
  margin-right: 15px;
  font-weight: 500;
}

.notification-close {
  background: none;
  border: none;
  font-size: 24px;
  line-height: 1;
  color: inherit;
  cursor: pointer;
  opacity: 0.7;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-close:hover {
  opacity: 1;
}
</style>
