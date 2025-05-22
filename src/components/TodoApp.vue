<script setup lang="ts">
interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
}

type TodoStatus = "active" | "completed" | "all";
</script>

<template>
  <div class="flex flex-col h-screen w-1/2 mx-auto space-y-3 p-4">
    <h1 class="text-4xl uppercase underline">My Todo List</h1>

    <input
      type="text"
      placeholder="Enter your task"
      class="border px-4 py-2 rounded-lg m-1/2"
    />

    <ul class="">
      <li>mock</li>
    </ul>
  </div>
</template>

<style lang="scss" scoped></style>
