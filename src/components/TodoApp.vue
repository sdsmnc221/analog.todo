<script setup lang="ts">
import type { Ref } from "vue";
import { ref } from "vue";
import { useTodoStore } from "../stores/useTodoStore";
import { storeToRefs } from "pinia";

import { ListChecks } from "lucide-vue-next";
import TodoItem from "./TodoItem.vue";
import useDnD from "../composables/useDnD";

const todosStore = useTodoStore();

const {
  filter,
  filterKeyword,
  todoCount,
  activeTodos,
  completedTodos,
  filteredTodos,
} = storeToRefs(todosStore);

const { addTodo, toggleAll, setFilter, deleteCompletedTodos, reorderTodos } =
  todosStore;

const { draggedIndex, dragOverIndex } = useDnD();

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

      <div class="flex-1 flex justify-end items-center text-sm gap-2">
        <button
          @click="toggleAll()"
          class="border rounded-lg px-2 py-2 text-xs hover:bg-sky-100 ease-in-out transition duration-1000"
        >
          Check / Uncheck all task
        </button>

        <button
          @click="deleteCompletedTodos()"
          class="border rounded-lg px-2 py-2 text-xs bg-red-50 hover:bg-red-100 ease-in-out transition duration-1000"
        >
          Remove completed task
        </button>
      </div>
    </h1>

    <div class="w-full flex justify-between items-center">
      <input
        type="text"
        placeholder="Filter task by keyword"
        class="border px-4 py-1 rounded-lg w-1/2 text-sm"
        v-model="filterKeyword"
      />

      <div class="flex p-2 gap-2 justify-end items-center text-sm">
        <button
          @click="setFilter('all')"
          :class="`border rounded-lg px-2 py-2 text-xs hover:bg-sky-100 ease-in-out transition duration-1000 ${
            filter === 'all' && 'bg-blue-50'
          }`"
        >
          All ({{ todoCount }})
        </button>
        <button
          @click="setFilter('active')"
          :class="`border rounded-lg px-2 py-2 text-xs hover:bg-sky-100 ease-in-out transition duration-1000 ${
            filter === 'active' && 'bg-blue-50'
          }`"
        >
          Active ({{ activeTodos.length }})
        </button>
        <button
          @click="setFilter('completed')"
          :class="`border rounded-lg px-2 py-2 text-xs hover:bg-sky-100 ease-in-out transition duration-1000 ${
            filter === 'completed' && 'bg-blue-50'
          }`"
        >
          Completed ({{ completedTodos.length }})
        </button>
      </div>
    </div>

    <div class="w-full flex justify-between text-sm gap-2">
      <input
        type="text"
        placeholder="Enter your task"
        class="border px-4 py-2 rounded-lg w-3/4"
        v-model="taskValue"
        @keyup="(e) => e.key === 'Enter' && handleAddTodo()"
      />

      <button
        @click="handleAddTodo"
        class="border rounded-lg px-4 py-2 bg-sky-50 hover:bg-sky-100 ease-in-out transition duration-1000"
      >
        Add (or Enter)
      </button>
    </div>

    <Transition>
      <ul class="" v-if="filteredTodos.length">
        <TransitionGroup>
          <todo-item
            v-for="(todo, todoIndex) in filteredTodos"
            :key="`todo-${todo.id}`"
            :todo="todo"
            :todo-index="todoIndex"
            @reorder="reorderTodos(draggedIndex, dragOverIndex)"
          ></todo-item>
        </TransitionGroup>
      </ul>

      <div v-else class="w-full text-center bg-red-50">No task found.</div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
