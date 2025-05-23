<script setup lang="ts">
import { BadgeX } from "lucide-vue-next";

import { type Todo } from "../interfaces/Todo";
import useDnD from "../composables/useDnD";
import { useTodoStore } from "../stores/useTodoStore";
import { storeToRefs } from "pinia";

interface TodoItemProps {
  todo: Todo;
  todoIndex: number;
}

const props = defineProps<TodoItemProps>();

const emits = defineEmits(["reorder"]);

const todosStore = useTodoStore();

const { filteredTodos } = storeToRefs(todosStore);
const { toggleTodo, deleteTodo } = todosStore;

const {
  handleDragStart,
  handleDragEnter,
  handleDragLeave,
  handleDragEnd,
  handleDragOver,
  handleDrop,
} = useDnD();

const handleKeyup = (e: KeyboardEvent) => {
  if (e.key === "Enter") {
    filteredTodos.value[props.todoIndex].editable = false;
  }
};

const handleTodoDrop = (e: DragEvent) => {
  handleDrop(e, props.todoIndex, () => emits("reorder"));
};
</script>

<template>
  <li
    @dragstart="(e) => handleDragStart(e, todo, todoIndex)"
    @dragend="handleDragEnd($event)"
    @dragenter="handleDragEnter($event)"
    @dragleave="handleDragLeave($event)"
    @dragover="handleDragOver($event, todoIndex)"
    @drop="handleTodoDrop($event)"
    :draggable="true"
    class="flex justify-start items-center gap-2"
  >
    <input
      type="checkbox"
      @input="toggleTodo(todo.id)"
      v-model="todo.completed"
      class="p-4"
    />
    <span
      @dblclick="() => (filteredTodos[todoIndex].editable = true)"
      class="flex-1 text-lg text-slate-600"
    >
      <span
        v-if="!todo.editable"
        :class="`${todo.completed && 'line-through'}`"
        >{{ todo.text }}</span
      >
      <input
        v-else
        type="text"
        v-model="todo.text"
        @keyup="handleKeyup"
        :class="`appearance-none outline-none ${
          todo.completed && 'line-through'
        }`"
      />
    </span>
    <button @click="deleteTodo(todo.id)">
      <BadgeX class="text-sm text-red-500" />
    </button>
  </li>
</template>
