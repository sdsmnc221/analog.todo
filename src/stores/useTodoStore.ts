import { defineStore } from "pinia";
import { ref, type Ref } from "vue";
import type { Todo, TodoStatus } from "../interfaces/Todo";

export const useTodoStore = defineStore("todoContext", () => {
  const todos: Ref<Todo[]> = ref([]);
  const filter: Ref<TodoStatus> = ref("all");

  const addTodo = (text: string) => {
    todos.value.push({
      id: todos.value.length + 1,
      text,
      completed: false,
      createdAt: new Date(),
    });
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

  const deleteTodo = (id: number) => {
    const selectedTodoIndex: number = todos.value.findIndex(
      (t: Todo) => t.id === id
    );
    if (selectedTodoIndex !== -1) {
      todos.value.splice(selectedTodoIndex, 1);
    }
  };

  return {
    todos,
    filter,
    addTodo,
    deleteTodo,
    toggleTodo,
  };
});
