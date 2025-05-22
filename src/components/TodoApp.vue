<script setup lang="ts">
import type { Ref } from "vue";
import { ref } from "vue";
import { useTodoStore } from "../stores/useTodoStore";
import { storeToRefs } from "pinia";

import { BadgeX, ListChecks } from "lucide-vue-next";

const todosStore = useTodoStore();

const { todos, todoCount, activeTodos, completedTodos } =
  storeToRefs(todosStore);

const { addTodo, deleteTodo } = todosStore;

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

    <div
      class="flex p-2 w-full bg-gray-50 gap-2 justify-between items-center text-sm"
    >
      <span>{{ todoCount }} task(s)</span>
      <span>{{ activeTodos.length }} incompleted task(s)</span>
      <span>{{ completedTodos.length }} completed task(s)</span>
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

    <ul class="" v-if="todos.length">
      <li
        v-for="todo in todos"
        :key="`todo-${todo.id}`"
        class="flex justify-start items-center gap-2"
      >
        <input type="checkbox" class="text-base" />
        <span class="flex-1 text-lg text-slate-600">{{ todo.text }}</span>
        <button @click="deleteTodo(todo.id)">
          <BadgeX class="text-sm text-red-500" />
        </button>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped></style>
