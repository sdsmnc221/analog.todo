<script setup lang="ts">
import type { Ref } from "vue";
import { ref } from "vue";
import { useTodoStore } from "../stores/useTodoStore";
import { storeToRefs } from "pinia";
import { type Todo } from "../interfaces/Todo";
import { BadgeX, ListChecks } from "lucide-vue-next";

const todosStore = useTodoStore();

const {
  filter,
  filterKeyword,
  todoCount,
  activeTodos,
  completedTodos,
  filteredTodos,
} = storeToRefs(todosStore);

const {
  addTodo,
  deleteTodo,
  toggleTodo,
  toggleAll,
  setFilter,
  deleteCompletedTodos,
} = todosStore;

const taskValue: Ref<string> = ref("");

const handleAddTodo = () => {
  if (taskValue.value.trim().length) {
    addTodo(taskValue.value);
  }

  taskValue.value = "";
};

const inlineEdit = (todo: Todo) => {
  todo.editable = true;
};

const draggedIndex: Ref<number> = ref(-1);
const dragOverIndex: Ref<number> = ref(-1);
const draggedItem: Ref<Todo | null> = ref(null);

const handleDragStart = (e: DragEvent, todo: Todo, targetIndex: number) => {
  if (!e.dataTransfer) return;

  draggedIndex.value = targetIndex;
  draggedItem.value = todo;

  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/plain", todo.id.toString());

  const dragImage = e.target as HTMLElement;
  e.dataTransfer.setDragImage(
    dragImage,
    dragImage.offsetWidth / 4,
    dragImage.offsetHeight / 4
  );
};

const handleDragEnd = (e: DragEvent) => {
  draggedIndex.value = -1;
  draggedItem.value = null;
  dragOverIndex.value = -1;
};

const handleDragOver = (e: DragEvent, targetIndex: number) => {
  e.preventDefault();

  if (!e.dataTransfer) return;

  e.dataTransfer.dropEffect = "move";

  dragOverIndex.value = targetIndex;
};

const handleDragEnter = (e: DragEvent) => {
  e.preventDefault();
};

const handleDragLeave = (e: DragEvent) => {
  e.preventDefault();
};

const handleDrop = (e: DragEvent, targetIndex: number) => {
  e.preventDefault();

  if (targetIndex === draggedIndex.value || draggedIndex.value === -1) return;

  const fromIndex = draggedIndex.value;
  const toIndex = targetIndex;
  const item = draggedItem.value!;

  filteredTodos.value.splice(fromIndex, 1);
  filteredTodos.value.splice(toIndex, 0, item);
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
          <li
            v-for="(todo, todoIndex) in filteredTodos"
            :key="`todo-${todo.id}`"
            @dragstart="(e) => handleDragStart(e, todo, todoIndex)"
            @dragend="handleDragEnd($event)"
            @dragenter="handleDragEnter($event)"
            @dragleave="handleDragLeave($event)"
            @dragover="handleDragOver($event, todoIndex)"
            @drop="(e) => handleDrop(e, todoIndex)"
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
              @dblclick="inlineEdit(todo)"
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
                :class="`appearance-none outline-none ${
                  todo.completed && 'line-through'
                }`"
              />
            </span>
            <button @click="deleteTodo(todo.id)">
              <BadgeX class="text-sm text-red-500" />
            </button>
          </li>
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
