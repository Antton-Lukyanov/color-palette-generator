<template>
  <div class="export-panel">
    <h3>📥 Экспорт палитры</h3>

    <div class="export-formats">
      <h4>Выберите формат экспорта:</h4>

      <div class="format-grid">
        <div
          v-for="format in exportFormats"
          :key="format.id"
          @click="selectFormat(format.id)"
          class="format-card"
          :class="{ active: selectedFormat === format.id }"
        >
          <div class="format-icon">{{ format.icon }}</div>
          <div class="format-info">
            <h5>{{ format.name }}</h5>
            <p>{{ format.description }}</p>
            <span class="format-extension">{{ format.extension }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="export-settings" v-if="selectedFormat">
      <h4>Настройки экспорта:</h4>

      <div class="settings-grid">
        <div class="setting-group">
          <label>Имя палитры:</label>
          <input
            v-model="paletteName"
            placeholder="my-palette"
            class="setting-input"
            type="text"
          />
        </div>

        <div class="setting-group">
          <label>Префикс переменных:</label>
          <input
            v-model="variablePrefix"
            placeholder="color"
            class="setting-input"
            type="text"
          />
        </div>

        <div class="setting-group">
          <label>Включить комментарии:</label>
          <label class="checkbox-label">
            <input
              v-model="includeComments"
              class="checkbox-input"
              type="checkbox"
            />
            <span class="checkbox-custom"></span>
            Добавить поясняющие комментарии
          </label>
        </div>

        <div
          class="setting-group"
          v-if="selectedFormat === 'css' || selectedFormat === 'scss'"
        >
          <label>Формат имен переменных:</label>
          <select v-model="namingConvention" class="setting-select">
            <option value="kebab">kebab-case (my-palette-1)</option>
            <option value="camel">camelCase (myPalette1)</option>
            <option value="snake">snake_case (my_palette_1)</option>
          </select>
        </div>
      </div>
    </div>

    <div class="export-preview" v-if="exportedCode">
      <h4>Предпросмотр:</h4>

      <div class="preview-toolbar">
        <button @click="copyToClipboard" class="copy-btn">
          📋 Копировать в буфер
        </button>
        <button @click="downloadFile" class="download-btn">
          💾 Скачать файл
        </button>
        <button @click="sharePalette" class="share-btn">🔗 Поделиться</button>
      </div>

      <div class="code-preview">
        <pre><code>{{ exportedCode }}</code></pre>
      </div>
    </div>

    <div class="export-actions">
      <button
        @click="generateExport"
        class="generate-btn"
        :disabled="!selectedFormat"
      >
        Сгенерировать код
      </button>
      <button @click="resetExport" class="reset-btn">Сбросить</button>
    </div>

    <div class="quick-exports">
      <h4>Быстрый экспорт:</h4>
      <div class="quick-buttons">
        <button
          v-for="quick in quickExports"
          :key="quick.format"
          @click="quickExport(quick.format)"
          class="quick-btn"
          :title="quick.tooltip"
        >
          {{ quick.icon }} {{ quick.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";
import {
  exportPalette,
  hexToRgbString,
  hexToHslString,
} from "../composables/usePaletteExport";

export default {
  name: "ExportPanel",

  props: {
    colors: {
      type: Array,
      default: () => [],
    },
    paletteName: {
      type: String,
      default: "palette",
    },
  },

  setup(props) {
    // Состояние экспорта
    const selectedFormat = ref("css");
    const exportFormats = ref([
      {
        id: "css",
        name: "CSS Variables",
        description: "Современные CSS custom properties",
        extension: ".css",
        icon: "🎨",
      },
      {
        id: "scss",
        name: "SCSS Variables",
        description: "Переменные для Sass/SCSS",
        extension: ".scss",
        icon: "⚡",
      },
      {
        id: "tailwind",
        name: "Tailwind Config",
        description: "Конфигурация для Tailwind CSS",
        extension: ".js",
        icon: "🌊",
      },
      {
        id: "json",
        name: "JSON",
        description: "Универсальный JSON формат",
        extension: ".json",
        icon: "📊",
      },
      {
        id: "ios",
        name: "iOS / SwiftUI",
        description: "Цвета для iOS разработки",
        extension: ".swift",
        icon: "📱",
      },
      {
        id: "android",
        name: "Android / XML",
        description: "Ресурсы для Android",
        extension: ".xml",
        icon: "🤖",
      },
    ]);

    // Настройки экспорта
    const paletteName = ref(props.paletteName);
    const variablePrefix = ref("color");
    const includeComments = ref(true);
    const namingConvention = ref("kebab");

    // Сгенерированный код
    const exportedCode = ref("");

    // Быстрый экспорт
    const quickExports = ref([
      {
        format: "css",
        label: "CSS",
        icon: "🎨",
        tooltip: "Экспорт в CSS переменные",
      },
      {
        format: "scss",
        label: "SCSS",
        icon: "⚡",
        tooltip: "Экспорт в SCSS переменные",
      },
      { format: "json", label: "JSON", icon: "📊", tooltip: "Экспорт в JSON" },
      {
        format: "copy",
        label: "HEX",
        icon: "📋",
        tooltip: "Скопировать HEX коды",
      },
    ]);

    // Выбор формата
    const selectFormat = (formatId) => {
      selectedFormat.value = formatId;
    };

    // Генерация кода экспорта
    const generateExport = () => {
      if (!selectedFormat.value) return;

      const colors = props.colors.map((c) => c.hex || c);

      switch (selectedFormat.value) {
        case "css":
          exportedCode.value = generateCssExport(colors);
          break;
        case "scss":
          exportedCode.value = generateScssExport(colors);
          break;
        case "tailwind":
          exportedCode.value = exportPalette(
            colors,
            "tailwind",
            paletteName.value
          );
          break;
        case "json":
          exportedCode.value = generateJsonExport(colors);
          break;
        case "ios":
          exportedCode.value = generateIosExport(colors);
          break;
        case "android":
          exportedCode.value = generateAndroidExport(colors);
          break;
        default:
          exportedCode.value = exportPalette(
            colors,
            selectedFormat.value,
            paletteName.value
          );
      }
    };

    // Генерация CSS экспорта
    const generateCssExport = (colors) => {
      let css = "";

      if (includeComments.value) {
        css += `/* CSS Color Variables for ${paletteName.value} */\n`;
        css += `/* Generated: ${new Date().toLocaleString("ru-RU")} */\n`;
        css += `/* Colors: ${colors.join(", ")} */\n\n`;
      }

      css += `:root {\n`;

      colors.forEach((color, index) => {
        const varName = getVariableName(index + 1);
        css += `  --${varName}: ${color};\n`;

        if (includeComments.value) {
          css += `  --${varName}-rgb: ${hexToRgbString(color)};\n`;
          css += `  --${varName}-hsl: ${hexToHslString(color)};\n`;
        }
      });

      css += "}\n\n";

      if (includeComments.value) {
        css += "/* Usage example */\n";
        css += ".element {\n";
        css += `  background-color: var(--${getVariableName(1)});\n`;
        css += `  color: var(--${getVariableName(colors.length)});\n`;
        css += "}\n";
      }

      return css;
    };

    // Генерация SCSS экспорта
    const generateScssExport = (colors) => {
      let scss = "";

      if (includeComments.value) {
        scss += `// SCSS Color Variables for ${paletteName.value}\n`;
        scss += `// Generated: ${new Date().toLocaleString("ru-RU")}\n`;
        scss += `// Colors: ${colors.join(", ")}\n\n`;
      }

      colors.forEach((color, index) => {
        const varName = getVariableName(index + 1);
        scss += `$${varName}: ${color};\n`;

        if (includeComments.value) {
          scss += `// RGB: ${hexToRgbString(color)}\n`;
          scss += `// HSL: ${hexToHslString(color)}\n\n`;
        }
      });

      scss += "\n";

      if (includeComments.value) {
        scss += "// Usage example\n";
        scss += ".element {\n";
        scss += `  background-color: $${getVariableName(1)};\n`;
        scss += `  color: $${getVariableName(colors.length)};\n`;
        scss += "}\n";
      }

      return scss;
    };

    // Генерация JSON экспорта
    const generateJsonExport = (colors) => {
      const data = {
        name: paletteName.value,
        palette: colors.map((color, index) => ({
          id: index + 1,
          hex: color,
          rgb: hexToRgbString(color),
          hsl: hexToHslString(color),
          variable: getVariableName(index + 1),
        })),
        metadata: {
          generated: new Date().toISOString(),
          colorsCount: colors.length,
          format: "json",
        },
      };

      return JSON.stringify(data, null, 2);
    };

    // Генерация iOS экспорта
    const generateIosExport = (colors) => {
      let swift = "";

      if (includeComments.value) {
        swift += `// SwiftUI Color Extension for ${paletteName.value}\n`;
        swift += `// Generated: ${new Date().toLocaleString("ru-RU")}\n\n`;
      }

      swift += `import SwiftUI\n\n`;
      swift += `extension Color {\n`;
      swift += `    // ${paletteName.value} Palette\n`;

      colors.forEach((color, index) => {
        const name = getVariableName(index + 1).replace(/-/g, "");
        swift += `    static let ${name} = Color(hex: "${color}")\n`;
      });

      swift += `}\n\n`;

      if (includeComments.value) {
        swift += `// Helper extension for hex colors\n`;
        swift += `extension Color {\n`;
        swift += `    init(hex: String) {\n`;
        swift += `        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)\n`;
        swift += `        var int: UInt64 = 0\n`;
        swift += `        Scanner(string: hex).scanHexInt64(&int)\n`;
        swift += `        let a, r, g, b: UInt64\n`;
        swift += `        switch hex.count {\n`;
        swift += `        case 3: // RGB (12-bit)\n`;
        swift += `            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)\n`;
        swift += `        case 6: // RGB (24-bit)\n`;
        swift += `            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)\n`;
        swift += `        case 8: // ARGB (32-bit)\n`;
        swift += `            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)\n`;
        swift += `        default:\n`;
        swift += `            (a, r, g, b) = (1, 1, 1, 0)\n`;
        swift += `        }\n`;
        swift += `        self.init(\n`;
        swift += `            .sRGB,\n`;
        swift += `            red: Double(r) / 255,\n`;
        swift += `            green: Double(g) / 255,\n`;
        swift += `            blue:  Double(b) / 255,\n`;
        swift += `            opacity: Double(a) / 255\n`;
        swift += `        )\n`;
        swift += `    }\n`;
        swift += `}\n`;
      }

      return swift;
    };

    // Генерация Android экспорта
    const generateAndroidExport = (colors) => {
      let xml = "";

      if (includeComments.value) {
        xml += `<!-- Android Color Resources for ${paletteName.value} -->\n`;
        xml += `<!-- Generated: ${new Date().toLocaleString("ru-RU")} -->\n\n`;
      }

      xml += `<?xml version="1.0" encoding="utf-8"?>\n`;
      xml += `<resources>\n`;

      colors.forEach((color, index) => {
        const name = getVariableName(index + 1);
        xml += `    <color name="${name}">${color}</color>\n`;
      });

      xml += `</resources>\n`;

      return xml;
    };

    // Получение имени переменной
    const getVariableName = (index) => {
      const prefix = variablePrefix.value || "color";
      const baseName = paletteName.value || "palette";

      switch (namingConvention.value) {
        case "camel":
          return `${prefix}${baseName.charAt(0).toUpperCase() + baseName.slice(1)}${index}`;
        case "snake":
          return `${prefix}_${baseName}_${index}`;
        case "kebab":
        default:
          return `${prefix}-${baseName}-${index}`;
      }
    };

    // Копирование в буфер
    const copyToClipboard = () => {
      if (!exportedCode.value) return;

      navigator.clipboard
        .writeText(exportedCode.value)
        .then(() => {
          const event = new CustomEvent("show-notification", {
            detail: {
              message: "Код скопирован в буфер обмена",
              type: "success",
            },
          });
          window.dispatchEvent(event);
        })
        .catch((err) => {
          console.error("Ошибка копирования:", err);
          const event = new CustomEvent("show-notification", {
            detail: {
              message: "Ошибка копирования",
              type: "error",
            },
          });
          window.dispatchEvent(event);
        });
    };

    // Скачивание файла
    const downloadFile = () => {
      if (!exportedCode.value) return;

      const format = exportFormats.value.find(
        (f) => f.id === selectedFormat.value
      );
      const filename = `${paletteName.value || "palette"}${format?.extension || ".txt"}`;
      const blob = new Blob([exportedCode.value], { type: "text/plain" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      const event = new CustomEvent("show-notification", {
        detail: {
          message: `Файл "${filename}" скачан`,
          type: "success",
        },
      });
      window.dispatchEvent(event);
    };

    // Поделиться палитрой
    const sharePalette = () => {
      const colors = props.colors.map((c) => c.hex || c);
      const shareData = {
        title: `Палитра: ${paletteName.value}`,
        text: `Цветовая палитра: ${colors.join(", ")}`,
        url: window.location.href,
      };

      if (navigator.share) {
        navigator
          .share(shareData)
          .then(() => console.log("Успешно поделились"))
          .catch((err) => console.log("Ошибка при sharing:", err));
      } else {
        // Fallback: копирование ссылки
        navigator.clipboard.writeText(window.location.href).then(() => {
          const event = new CustomEvent("show-notification", {
            detail: {
              message: "Ссылка скопирована в буфер",
              type: "success",
            },
          });
          window.dispatchEvent(event);
        });
      }
    };

    // Быстрый экспорт
    const quickExport = (format) => {
      if (format === "copy") {
        const hexCodes = props.colors.map((c) => c.hex || c).join(", ");
        navigator.clipboard.writeText(hexCodes).then(() => {
          const event = new CustomEvent("show-notification", {
            detail: {
              message: "HEX коды скопированы",
              type: "success",
            },
          });
          window.dispatchEvent(event);
        });
      } else {
        selectedFormat.value = format;
        generateExport();
      }
    };

    // Сброс экспорта
    const resetExport = () => {
      selectedFormat.value = "css";
      exportedCode.value = "";
      paletteName.value = props.paletteName;
      variablePrefix.value = "color";
      includeComments.value = true;
      namingConvention.value = "kebab";
    };

    // Автоматическая генерация при изменении параметров
    watch(
      () => [
        selectedFormat.value,
        paletteName.value,
        variablePrefix.value,
        includeComments.value,
        namingConvention.value,
      ],
      () => {
        if (exportedCode.value) {
          generateExport();
        }
      }
    );

    return {
      // Состояние
      selectedFormat,
      exportFormats,
      paletteName,
      variablePrefix,
      includeComments,
      namingConvention,
      exportedCode,
      quickExports,

      // Методы
      selectFormat,
      generateExport,
      copyToClipboard,
      downloadFile,
      sharePalette,
      quickExport,
      resetExport,
    };
  },
};
</script>

<style scoped>
.export-panel {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.export-panel h3 {
  margin-bottom: 20px;
  color: #333;
}

.export-panel h4 {
  margin-bottom: 15px;
  color: #2d3748;
}

.export-formats {
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.format-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.format-card {
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
  display: flex;
  gap: 15px;
  align-items: flex-start;
}

.format-card:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
}

.format-card.active {
  border-color: #667eea;
  background-color: #f7f9ff;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.format-icon {
  font-size: 24px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  border-radius: 8px;
  flex-shrink: 0;
}

.format-info {
  flex: 1;
}

.format-info h5 {
  margin: 0 0 5px 0;
  color: #2d3748;
  font-size: 16px;
}

.format-info p {
  margin: 0 0 8px 0;
  color: #718096;
  font-size: 13px;
  line-height: 1.4;
}

.format-extension {
  font-size: 11px;
  color: #a0aec0;
  background-color: #f1f5f9;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: "Courier New", monospace;
}

.export-settings {
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.setting-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.setting-group label {
  font-weight: 600;
  color: #555;
  font-size: 14px;
}

.setting-input,
.setting-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  background: white;
}

.setting-select {
  cursor: pointer;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: normal;
  user-select: none;
}

.checkbox-input {
  display: none;
}

.checkbox-custom {
  width: 18px;
  height: 18px;
  border: 2px solid #ddd;
  border-radius: 3px;
  position: relative;
  flex-shrink: 0;
}

.checkbox-input:checked + .checkbox-custom {
  background-color: #667eea;
  border-color: #667eea;
}

.checkbox-input:checked + .checkbox-custom::after {
  content: "✓";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.export-preview {
  margin-bottom: 25px;
}

.preview-toolbar {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.copy-btn,
.download-btn,
.share-btn {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.copy-btn {
  background-color: #3b82f6;
  color: white;
}

.copy-btn:hover {
  background-color: #2563eb;
}

.download-btn {
  background-color: #10b981;
  color: white;
}

.download-btn:hover {
  background-color: #059669;
}

.share-btn {
  background-color: #8b5cf6;
  color: white;
}

.share-btn:hover {
  background-color: #7c3aed;
}

.code-preview {
  background-color: #1a202c;
  border-radius: 8px;
  padding: 20px;
  overflow-x: auto;
  max-height: 300px;
  overflow-y: auto;
}

.code-preview pre {
  margin: 0;
  font-family: "Courier New", monospace;
  font-size: 13px;
  line-height: 1.5;
}

.code-preview code {
  color: #e2e8f0;
}

.export-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
}

.generate-btn,
.reset-btn {
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.generate-btn {
  background-color: #667eea;
  color: white;
}

.generate-btn:hover:not(:disabled) {
  background-color: #5a67d8;
}

.generate-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.reset-btn {
  background-color: #e2e8f0;
  color: #4a5568;
}

.reset-btn:hover {
  background-color: #cbd5e0;
}

.quick-exports h4 {
  margin-bottom: 15px;
}

.quick-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
}

.quick-btn {
  padding: 10px 15px;
  background-color: #f8f9fa;
  border: 1px solid #e2e8f0;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 600;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.quick-btn:hover {
  background-color: #e2e8f0;
  border-color: #cbd5e0;
}

@media (max-width: 768px) {
  .format-grid {
    grid-template-columns: 1fr;
  }

  .settings-grid {
    grid-template-columns: 1fr;
  }

  .preview-toolbar {
    flex-direction: column;
  }

  .quick-buttons {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
