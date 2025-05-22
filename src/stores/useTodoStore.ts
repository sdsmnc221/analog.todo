import { defineStore } from "pinia";
import { computed, ref, type ComputedRef, type Ref } from "vue";
import type { Todo, TodoStatus } from "../interfaces/Todo";

export const useTodoStore = defineStore("todoContext", () => {
  const todos: Ref<Todo[]> = ref([]);
  const filter: Ref<TodoStatus> = ref("all");

  const activeTodos: ComputedRef<Todo[]> = computed(() =>
    todos.value.filter((t: Todo) => !t.completed)
  );
  const completedTodos: ComputedRef<Todo[]> = computed(() =>
    todos.value.filter((t: Todo) => t.completed)
  );
  const filteredTodos: ComputedRef<Todo[]> = computed(() => {
    switch (filter.value) {
      case "all":
        return todos.value;
      case "active":
        return activeTodos.value;
      case "completed":
        return completedTodos.value;
      default:
        return [];
    }
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

  return {
    todos,
    todoCount,
    activeTodos,
    completedTodos,
    filteredTodos,
    filter,
    setFilter,
    addTodo,
    deleteTodo,
    toggleTodo,
    editTodo,
    toggleAll,
    deleteCompletedTodos,
  };
});
