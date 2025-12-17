<template>
  <div class="palette-library">
    <h3>📚 Библиотека палитр</h3>

    <div class="library-controls">
      <div class="search-bar">
        <input
          v-model="searchQuery"
          placeholder="Поиск по названию или тегам..."
          class="search-input"
          type="text"
        />
        <button
          @click="clearSearch"
          class="clear-search-btn"
          title="Очистить поиск"
        >
          ×
        </button>
      </div>

      <div class="filter-tags">
        <span class="filter-label">Фильтр по тегам:</span>
        <div class="tags-container">
          <button
            v-for="tag in availableTags"
            :key="tag"
            @click="toggleTag(tag)"
            class="tag-btn"
            :class="{ active: selectedTags.includes(tag) }"
          >
            {{ tag }}
          </button>
        </div>
      </div>

      <div class="sort-controls">
        <label>Сортировка:</label>
        <select v-model="sortBy" class="sort-select">
          <option value="date">По дате</option>
          <option value="name">По названию</option>
          <option value="colors">По количеству цветов</option>
        </select>
        <button
          @click="toggleSortOrder"
          class="sort-order-btn"
          :title="sortAscending ? 'По возрастанию' : 'По убыванию'"
        >
          {{ sortAscending ? "↑" : "↓" }}
        </button>
      </div>
    </div>

    <div class="palette-actions">
      <button @click="openSaveModal" class="save-palette-btn">
        💾 Сохранить текущую палитру
      </button>
      <button
        @click="exportAll"
        class="export-all-btn"
        :disabled="filteredPalettes.length === 0"
      >
        📥 Экспорт всех
      </button>
    </div>

    <div v-if="filteredPalettes.length === 0" class="empty-library">
      <p>Библиотека пуста. Сохраните свою первую палитру!</p>
      <button @click="addSamplePalettes" class="add-sample-btn">
        Добавить примеры палитр
      </button>
    </div>

    <div v-else class="palettes-grid">
      <div
        v-for="palette in filteredPalettes"
        :key="palette.id"
        class="palette-card"
        :class="{ favorite: palette.favorite }"
      >
        <div class="palette-header">
          <h4>{{ palette.name }}</h4>
          <div class="palette-actions">
            <button
              @click="toggleFavorite(palette.id)"
              class="fav-btn"
              :title="
                palette.favorite
                  ? 'Удалить из избранного'
                  : 'Добавить в избранное'
              "
            >
              {{ palette.favorite ? "★" : "☆" }}
            </button>
            <button
              @click="editPalette(palette)"
              class="edit-btn"
              title="Редактировать"
            >
              ✏️
            </button>
            <button
              @click="deletePalette(palette.id)"
              class="delete-btn"
              title="Удалить"
            >
              🗑️
            </button>
          </div>
        </div>

        <div class="palette-colors">
          <div
            v-for="color in palette.colors"
            :key="color"
            class="library-color"
            :style="{ backgroundColor: color }"
            :title="color"
          ></div>
        </div>

        <div class="palette-info">
          <div class="palette-meta">
            <span class="meta-item">
              🎨 {{ palette.colors.length }} цветов
            </span>
            <span class="meta-item">
              📅 {{ formatDate(palette.created) }}
            </span>
          </div>

          <div class="palette-tags">
            <span v-for="tag in palette.tags" :key="tag" class="tag">
              {{ tag }}
            </span>
          </div>

          <div class="palette-export">
            <button
              @click="loadPalette(palette)"
              class="load-btn"
              title="Загрузить палитру"
            >
              Загрузить
            </button>
            <button
              @click="exportPalette(palette)"
              class="export-btn"
              title="Экспорт палитры"
            >
              Экспорт
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно сохранения палитры -->
    <div v-if="showSaveModal" class="modal-overlay" @click="closeSaveModal">
      <div class="modal-content" @click.stop>
        <h3>💾 Сохранить палитру</h3>

        <div class="modal-form">
          <div class="form-group">
            <label>Название палитры:</label>
            <input
              v-model="newPaletteName"
              placeholder="Моя палитра"
              class="form-input"
              type="text"
            />
          </div>

          <div class="form-group">
            <label>Теги (через запятую):</label>
            <input
              v-model="newPaletteTags"
              placeholder="веб, интерфейс, брендинг"
              class="form-input"
              type="text"
            />
            <div class="tags-suggestions">
              <span class="suggestion-label">Популярные теги:</span>
              <button
                v-for="tag in popularTags"
                :key="tag"
                @click="addTagToInput(tag)"
                class="suggestion-tag"
              >
                {{ tag }}
              </button>
            </div>
          </div>

          <div class="form-group">
            <label>Описание (необязательно):</label>
            <textarea
              v-model="newPaletteDescription"
              placeholder="Описание палитры..."
              class="form-textarea"
              rows="3"
            ></textarea>
          </div>

          <div class="modal-actions">
            <button @click="saveCurrentPalette" class="save-btn">
              Сохранить
            </button>
            <button @click="closeSaveModal" class="cancel-btn">Отмена</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно редактирования палитры -->
    <div v-if="editingPalette" class="modal-overlay" @click="cancelEdit">
      <div class="modal-content" @click.stop>
        <h3>✏️ Редактировать палитру</h3>

        <div class="modal-form">
          <div class="form-group">
            <label>Название палитры:</label>
            <input
              v-model="editingPalette.name"
              class="form-input"
              type="text"
            />
          </div>

          <div class="form-group">
            <label>Теги (через запятую):</label>
            <input
              v-model="editingPalette.tagsString"
              placeholder="веб, интерфейс, брендинг"
              class="form-input"
              type="text"
            />
          </div>

          <div class="form-group">
            <label>Описание:</label>
            <textarea
              v-model="editingPalette.description"
              class="form-textarea"
              rows="3"
            ></textarea>
          </div>

          <div class="modal-actions">
            <button @click="updatePalette" class="save-btn">Обновить</button>
            <button @click="cancelEdit" class="cancel-btn">Отмена</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { exportPalette } from "../composables/usePaletteExport";

export default {
  name: "PaletteLibrary",

  props: {
    currentColors: {
      type: Array,
      default: () => [],
    },
  },

  emits: ["loadPalette"],

  setup(props, { emit }) {
    // Состояние библиотеки
    const palettes = ref([]);
    const searchQuery = ref("");
    const selectedTags = ref([]);
    const sortBy = ref("date");
    const sortAscending = ref(false);

    // Модальные окна
    const showSaveModal = ref(false);
    const editingPalette = ref(null);

    // Данные новой палитры
    const newPaletteName = ref("");
    const newPaletteTags = ref("");
    const newPaletteDescription = ref("");

    // Доступные теги
    const availableTags = ref([
      "веб",
      "интерфейс",
      "брендинг",
      "мобильный",
      "градиент",
      "минимализм",
      "яркий",
      "пастельный",
      "осенний",
      "весенний",
      "летний",
      "зимний",
      "работа",
      "личное",
      "архив",
    ]);

    const popularTags = computed(() => {
      return ["веб", "интерфейс", "брендинг", "градиент", "минимализм"];
    });

    // Фильтрация и сортировка палитр
    const filteredPalettes = computed(() => {
      let filtered = [...palettes.value];

      // Поиск по названию и тегам
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(
          (palette) =>
            palette.name.toLowerCase().includes(query) ||
            palette.tags.some((tag) => tag.toLowerCase().includes(query)) ||
            (palette.description &&
              palette.description.toLowerCase().includes(query))
        );
      }

      // Фильтрация по тегам
      if (selectedTags.value.length > 0) {
        filtered = filtered.filter((palette) =>
          selectedTags.value.every((tag) => palette.tags.includes(tag))
        );
      }

      // Сортировка
      filtered.sort((a, b) => {
        let comparison = 0;

        switch (sortBy.value) {
          case "name":
            comparison = a.name.localeCompare(b.name);
            break;
          case "colors":
            comparison = a.colors.length - b.colors.length;
            break;
          case "date":
          default:
            comparison = new Date(b.created) - new Date(a.created);
            break;
        }

        return sortAscending.value ? comparison : -comparison;
      });

      return filtered;
    });

    // Загрузка из localStorage
    const loadFromStorage = () => {
      const saved = localStorage.getItem("paletteLibrary");
      if (saved) {
        palettes.value = JSON.parse(saved);
      }
    };

    // Сохранение в localStorage
    const saveToStorage = () => {
      localStorage.setItem("paletteLibrary", JSON.stringify(palettes.value));
    };

    // Открытие модального окна сохранения
    const openSaveModal = () => {
      newPaletteName.value = `Палитра ${palettes.value.length + 1}`;
      newPaletteTags.value = "";
      newPaletteDescription.value = "";
      showSaveModal.value = true;
    };

    // Закрытие модального окна
    const closeSaveModal = () => {
      showSaveModal.value = false;
    };

    // Сохранение текущей палитры
    const saveCurrentPalette = () => {
      if (!newPaletteName.value.trim()) {
        alert("Введите название палитры");
        return;
      }

      const tags = newPaletteTags.value
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const newPalette = {
        id: Date.now(),
        name: newPaletteName.value,
        colors: [...props.currentColors.map((c) => c.hex || c)],
        tags: tags,
        description: newPaletteDescription.value,
        created: new Date().toISOString(),
        favorite: false,
      };

      palettes.value.unshift(newPalette);
      saveToStorage();
      closeSaveModal();

      // Показываем уведомление
      const event = new CustomEvent("show-notification", {
        detail: {
          message: `Палитра "${newPalette.name}" сохранена!`,
          type: "success",
        },
      });
      window.dispatchEvent(event);
    };

    // Добавление тега в поле ввода
    const addTagToInput = (tag) => {
      if (newPaletteTags.value) {
        newPaletteTags.value += `, ${tag}`;
      } else {
        newPaletteTags.value = tag;
      }
    };

    // Переключение тега фильтра
    const toggleTag = (tag) => {
      const index = selectedTags.value.indexOf(tag);
      if (index === -1) {
        selectedTags.value.push(tag);
      } else {
        selectedTags.value.splice(index, 1);
      }
    };

    // Очистка поиска
    const clearSearch = () => {
      searchQuery.value = "";
    };

    // Переключение порядка сортировки
    const toggleSortOrder = () => {
      sortAscending.value = !sortAscending.value;
    };

    // Загрузка палитры в редактор
    const loadPalette = (palette) => {
      emit("loadPalette", palette.colors);

      const event = new CustomEvent("show-notification", {
        detail: {
          message: `Палитра "${palette.name}" загружена`,
          type: "success",
        },
      });
      window.dispatchEvent(event);
    };

    // Экспорт палитры
    const exportPalette = (palette) => {
      const formats = ["css", "scss", "tailwind", "json"];
      const format = prompt(
        "Выберите формат экспорта:\n1. CSS Variables\n2. SCSS Variables\n3. Tailwind Config\n4. JSON",
        "1"
      );

      if (format && formats[parseInt(format) - 1]) {
        const selectedFormat = formats[parseInt(format) - 1];
        const exported = exportPalette(
          palette.colors,
          selectedFormat,
          palette.name
        );

        // Создаем временный элемент для копирования
        const textarea = document.createElement("textarea");
        textarea.value = exported;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);

        const event = new CustomEvent("show-notification", {
          detail: {
            message: `Палитра экспортирована в ${selectedFormat.toUpperCase()} и скопирована в буфер`,
            type: "success",
          },
        });
        window.dispatchEvent(event);
      }
    };

    // Экспорт всех палитр
    const exportAll = () => {
      const allPalettes = {
        library: palettes.value,
        exported: new Date().toISOString(),
        version: "1.0",
      };

      const json = JSON.stringify(allPalettes, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "color-palette-library.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

    // Редактирование палитры
    const editPalette = (palette) => {
      editingPalette.value = {
        ...palette,
        tagsString: palette.tags.join(", "),
      };
    };

    // Обновление палитры
    const updatePalette = () => {
      if (!editingPalette.value.name.trim()) {
        alert("Введите название палитры");
        return;
      }

      const tags = editingPalette.value.tagsString
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const index = palettes.value.findIndex(
        (p) => p.id === editingPalette.value.id
      );
      if (index !== -1) {
        palettes.value[index] = {
          ...editingPalette.value,
          tags: tags,
        };
        delete palettes.value[index].tagsString;

        saveToStorage();
        editingPalette.value = null;

        const event = new CustomEvent("show-notification", {
          detail: {
            message: "Палитра обновлена",
            type: "success",
          },
        });
        window.dispatchEvent(event);
      }
    };

    // Отмена редактирования
    const cancelEdit = () => {
      editingPalette.value = null;
    };

    // Удаление палитры
    const deletePalette = (id) => {
      if (confirm("Вы уверены, что хотите удалить эту палитру?")) {
        const index = palettes.value.findIndex((p) => p.id === id);
        if (index !== -1) {
          palettes.value.splice(index, 1);
          saveToStorage();

          const event = new CustomEvent("show-notification", {
            detail: {
              message: "Палитра удалена",
              type: "success",
            },
          });
          window.dispatchEvent(event);
        }
      }
    };

    // Переключение избранного
    const toggleFavorite = (id) => {
      const palette = palettes.value.find((p) => p.id === id);
      if (palette) {
        palette.favorite = !palette.favorite;
        saveToStorage();
      }
    };

    // Добавление примеров палитр
    const addSamplePalettes = () => {
      const samples = [
        {
          id: Date.now() + 1,
          name: "Океанская глубина",
          colors: ["#1a2980", "#26d0ce", "#4facfe", "#00f2fe", "#667eea"],
          tags: ["океан", "градиент", "прохладный"],
          description: "Глубокие синие тона, вдохновленные океаном",
          created: new Date("2024-01-15").toISOString(),
          favorite: true,
        },
        {
          id: Date.now() + 2,
          name: "Закат в пустыне",
          colors: ["#ff7e5f", "#feb47b", "#ff6b6b", "#ee9ca7", "#ffdde1"],
          tags: ["теплый", "пустыня", "закат"],
          description: "Теплые оранжевые и розовые оттенки заката",
          created: new Date("2024-02-20").toISOString(),
          favorite: false,
        },
        {
          id: Date.now() + 3,
          name: "Весенний сад",
          colors: ["#43e97b", "#38f9d7", "#a8edea", "#fed6e3", "#fa709a"],
          tags: ["весна", "сады", "пастельный"],
          description: "Свежие весенние цвета цветущего сада",
          created: new Date("2024-03-10").toISOString(),
          favorite: true,
        },
      ];

      palettes.value.unshift(...samples);
      saveToStorage();
    };

    // Форматирование даты
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    };

    // Инициализация при монтировании
    onMounted(() => {
      loadFromStorage();

      // Если библиотека пуста, добавляем примеры
      if (palettes.value.length === 0) {
        addSamplePalettes();
      }
    });

    return {
      // Состояние
      palettes: filteredPalettes,
      searchQuery,
      selectedTags,
      sortBy,
      sortAscending,
      showSaveModal,
      editingPalette,
      newPaletteName,
      newPaletteTags,
      newPaletteDescription,
      availableTags,
      popularTags,

      // Методы
      openSaveModal,
      closeSaveModal,
      saveCurrentPalette,
      addTagToInput,
      toggleTag,
      clearSearch,
      toggleSortOrder,
      loadPalette,
      exportPalette,
      exportAll,
      editPalette,
      updatePalette,
      cancelEdit,
      deletePalette,
      toggleFavorite,
      addSamplePalettes,
      formatDate,
    };
  },
};
</script>

<style scoped>
.palette-library {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.palette-library h3 {
  margin-bottom: 20px;
  color: #333;
}

.library-controls {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.search-bar {
  position: relative;
}

.search-input {
  width: 100%;
  padding: 10px 40px 10px 15px;
  border: 1px solid #ddd;
  border-radius: 25px;
  font-size: 14px;
}

.clear-search-btn {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 20px;
  color: #a0aec0;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-search-btn:hover {
  color: #718096;
}

.filter-tags {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.filter-label {
  font-weight: 600;
  color: #555;
  font-size: 14px;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-btn {
  padding: 6px 12px;
  background-color: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 15px;
  font-size: 12px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tag-btn:hover {
  background-color: #e2e8f0;
  color: #475569;
}

.tag-btn.active {
  background-color: #667eea;
  color: white;
  border-color: #667eea;
}

.sort-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sort-controls label {
  font-weight: 600;
  color: #555;
  font-size: 14px;
  white-space: nowrap;
}

.sort-select {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  background: white;
  cursor: pointer;
}

.sort-order-btn {
  padding: 8px 12px;
  background-color: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 5px;
  font-size: 14px;
  font-weight: bold;
  color: #64748b;
  cursor: pointer;
  min-width: 40px;
}

.sort-order-btn:hover {
  background-color: #e2e8f0;
}

.palette-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.save-palette-btn,
.export-all-btn {
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.save-palette-btn {
  background-color: #667eea;
  color: white;
}

.save-palette-btn:hover {
  background-color: #5a67d8;
}

.export-all-btn {
  background-color: #48bb78;
  color: white;
}

.export-all-btn:hover:not(:disabled) {
  background-color: #38a169;
}

.export-all-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.empty-library {
  text-align: center;
  padding: 40px 20px;
  color: #a0aec0;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 2px dashed #e2e8f0;
}

.empty-library p {
  margin-bottom: 20px;
  font-size: 16px;
}

.add-sample-btn {
  padding: 10px 20px;
  background-color: #ed8936;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.add-sample-btn:hover {
  background-color: #dd6b20;
}

.palettes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.palette-card {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  background: white;
  transition: all 0.3s ease;
}

.palette-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.palette-card.favorite {
  border-color: #fbbf24;
  background-color: #fffbeb;
}

.palette-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.palette-header h4 {
  margin: 0;
  color: #2d3748;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.palette-actions {
  display: flex;
  gap: 5px;
}

.palette-actions button {
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 5px;
  background: white;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.fav-btn {
  color: #fbbf24;
}

.fav-btn:hover {
  background-color: #fef3c7;
}

.edit-btn {
  color: #3b82f6;
}

.edit-btn:hover {
  background-color: #dbeafe;
}

.delete-btn {
  color: #ef4444;
}

.delete-btn:hover {
  background-color: #fee2e2;
}

.palette-colors {
  display: flex;
  height: 60px;
}

.library-color {
  flex: 1;
}

.palette-info {
  padding: 15px;
}

.palette-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 12px;
  color: #718096;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.palette-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 15px;
}

.tag {
  padding: 3px 8px;
  background-color: #f1f5f9;
  border-radius: 10px;
  font-size: 11px;
  color: #64748b;
}

.palette-export {
  display: flex;
  gap: 10px;
}

.load-btn,
.export-btn {
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.load-btn {
  background-color: #3b82f6;
  color: white;
}

.load-btn:hover {
  background-color: #2563eb;
}

.export-btn {
  background-color: #10b981;
  color: white;
}

.export-btn:hover {
  background-color: #059669;
}

/* Модальные окна */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 10px;
  padding: 30px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #2d3748;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #555;
  font-size: 14px;
}

.form-input,
.form-textarea {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  font-family: inherit;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.tags-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 5px;
}

.suggestion-label {
  font-size: 12px;
  color: #718096;
  align-self: center;
}

.suggestion-tag {
  padding: 4px 8px;
  background-color: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 11px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
}

.suggestion-tag:hover {
  background-color: #e2e8f0;
  color: #475569;
}

.modal-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.save-btn,
.cancel-btn {
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.save-btn {
  background-color: #667eea;
  color: white;
}

.save-btn:hover {
  background-color: #5a67d8;
}

.cancel-btn {
  background-color: #e2e8f0;
  color: #4a5568;
}

.cancel-btn:hover {
  background-color: #cbd5e0;
}

@media (max-width: 768px) {
  .library-controls {
    gap: 20px;
  }

  .palettes-grid {
    grid-template-columns: 1fr;
  }

  .modal-content {
    padding: 20px;
  }
}
</style>
