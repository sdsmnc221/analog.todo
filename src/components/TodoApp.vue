<script setup lang="ts">
import type { Ref } from "vue";
import { ref } from "vue";
import { useTodoStore } from "../stores/useTodoStore";
import { storeToRefs } from "pinia";

import { BadgeX, ListChecks } from "lucide-vue-next";

const todosStore = useTodoStore();

const { filter, todoCount, activeTodos, completedTodos, filteredTodos } =
  storeToRefs(todosStore);

const { addTodo, deleteTodo, toggleTodo, setFilter } = todosStore;

const taskValue: Ref<string> = ref("");

const handleAddTodo = () => {
  if (taskValue.value.trim().length) {
    addTodo(taskValue.value);
  }

  taskValue.value = "";
};
</script>

<template>
  <div class="flex flex-col h-screen w-1/2 mx-auto space-y-3 p-4">
    <h1 class="text-4xl flex items-center gap-2">
      <ListChecks class="text-6xl" />
      <span class="uppercase">My Todo List</span>
    </h1>

    <div class="flex p-2 w-full gap-2 justify-end items-center text-sm">
      <button
        @click="setFilter('all')"
        :class="`border rounded-lg px-2 py-2 text-xs hover:bg-sky-100 ${
          filter === 'all' && 'bg-blue-50'
        }`"
      >
        All ({{ todoCount }})
      </button>
      <button
        @click="setFilter('active')"
        :class="`border rounded-lg px-2 py-2 text-xs hover:bg-sky-100 ${
          filter === 'active' && 'bg-blue-50'
        }`"
      >
        Active ({{ activeTodos.length }})
      </button>
      <button
        @click="setFilter('completed')"
        :class="`border rounded-lg px-2 py-2 text-xs hover:bg-sky-100 ${
          filter === 'completed' && 'bg-blue-50'
        }`"
      >
        Completed ({{ completedTodos.length }})
      </button>
    </div>

    <div class="w-full flex justify-between">
      <input
        type="text"
        placeholder="Enter your task"
        class="border px-4 py-2 rounded-lg w-3/4"
        v-model="taskValue"
      />

      <button
        @click="handleAddTodo"
        class="border rounded-lg px-4 py-2 hover:bg-sky-100"
      >
        Add
      </button>
    </div>

    <ul class="" v-if="filteredTodos.length">
      <li
        v-for="todo in filteredTodos"
        :key="`todo-${todo.id}`"
        :class="`flex justify-start items-center gap-2 ${
          todo.completed && 'line-through'
        }`"
      >
        <input
          type="checkbox"
          @change="toggleTodo(todo.id)"
          v-model="todo.completed"
          class="text-base"
        />
        <span class="flex-1 text-lg text-slate-600">{{ todo.text }}</span>
        <button @click="deleteTodo(todo.id)">
          <BadgeX class="text-sm text-red-500" />
        </button>
      </li>
    </ul>

    <div v-else class="w-full text-center bg-red-50">No task found.</div>
  </div>
</template>

<style lang="scss" scoped></style>
