import { defineStore } from "pinia";
import {
  computed,
  ref,
  type ComputedRef,
  type Ref,
  watch,
  onMounted,
} from "vue";
import type { Todo, TodoStatus } from "../interfaces/Todo";

export const useTodoStore = defineStore("todoContext", () => {
  const todos: Ref<Todo[]> = ref([]);
  const filter: Ref<TodoStatus> = ref("all");
  const filterKeyword: Ref<string> = ref("");

  const activeTodos: ComputedRef<Todo[]> = computed(() =>
    todos.value.length > 0 ? todos.value.filter((t: Todo) => !t.completed) : []
  );
  const completedTodos: ComputedRef<Todo[]> = computed(() =>
    todos.value.length > 0 ? todos.value.filter((t: Todo) => t.completed) : []
  );

  const filteredTodos: ComputedRef<Todo[]> = computed(() => {
    let usingTodo: Todo[] = [];
    switch (filter.value) {
      case "all":
        usingTodo = todos.value;
        break;
      case "active":
        usingTodo = activeTodos.value;
        break;
      case "completed":
        usingTodo = completedTodos.value;
        break;
      default:
        break;
    }

    if (filterKeyword.value.length) {
      return usingTodo.filter((t: Todo) =>
        t.text
          .trim()
          .toLowerCase()
          .includes(filterKeyword.value.trim().toLowerCase())
      );
    }
    return usingTodo;
  });

  const todoCount: ComputedRef<number> = computed(() => todos.value.length);

  const setFilter = (text: "active" | "completed" | "all") => {
    if (text !== "active" && text !== "completed" && text !== "all") {
      return;
    }

    filter.value = text;
  };

  const addTodo = (text: string) => {
    todos.value.push({
      id: todos.value.length + 1,
      text,
      completed: false,
      createdAt: new Date(),
      editable: false,
    });
  };

  const editTodo = (id: number, text: string) => {
    const selectedTodoIndex: number = todos.value.findIndex(
      (t: Todo) => t.id === id
    );
    if (selectedTodoIndex !== -1) {
      todos.value[selectedTodoIndex].text = text;
    }
  };

  const toggleTodo = (id: number) => {
    const selectedTodoIndex: number = todos.value.findIndex(
      (t: Todo) => t.id === id
    );
    if (selectedTodoIndex !== -1) {
      todos.value[selectedTodoIndex].completed =
        !todos.value[selectedTodoIndex].completed;
    }
  };

  const toggleAll = () => {
    todos.value.map((todo: Todo) => {
      todo.completed = !todo.completed;
      return todo;
    });
  };

  const deleteTodo = (id: number) => {
    const selectedTodoIndex: number = todos.value.findIndex(
      (t: Todo) => t.id === id
    );
    if (selectedTodoIndex !== -1) {
      todos.value.splice(selectedTodoIndex, 1);
    }
  };

  const deleteCompletedTodos = () => {
    todos.value = todos.value.filter((t: Todo) => !t.completed);
  };

  const reorderTodos = (fromIndex: number, toIndex: number) => {
    const item = todos.value[fromIndex];
    console.log(item, fromIndex);
    filteredTodos.value.splice(fromIndex, 1);
    filteredTodos.value.splice(toIndex, 0, item);
  };

  const saveToStorage = () => {
    localStorage.setItem("todos", JSON.stringify(todos.value));
  };

  const loadFromStorage = () => {
    const todosFromStorage = localStorage.getItem("todos");
    if (todosFromStorage) {
      todos.value = JSON.parse(todosFromStorage);
    }
  };

  watch(
    () => todos.value,
    () => {
      saveToStorage();
    },
    { deep: true }
  );

  onMounted(() => {
    loadFromStorage();
  });

  return {
    todos,
    todoCount,
    activeTodos,
    completedTodos,
    filteredTodos,
    filter,
    filterKeyword,
    setFilter,
    addTodo,
    deleteTodo,
    toggleTodo,
    editTodo,
    toggleAll,
    deleteCompletedTodos,
    reorderTodos,
  };
});
