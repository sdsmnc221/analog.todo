import { type Ref, ref } from "vue";
import { type Todo } from "../interfaces/Todo";
import { useTodoStore } from "../stores/useTodoStore";

export default function useDnD() {
  const todosStore = useTodoStore();
  const { reorderTodos } = todosStore;

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
    e.preventDefault();
    // setTimeout(() => {
    //   draggedIndex.value = -1;
    //   draggedItem.value = null;
    //   dragOverIndex.value = -1;
    // }, 1200);
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

  const handleDrop = (
    e: DragEvent,
    targetIndex: number,
    reorderCb: () => void
  ) => {
    console.log(targetIndex, draggedIndex.value);
    if (targetIndex === draggedIndex.value || draggedIndex.value === -1) return;

    dragOverIndex.value = targetIndex;

    reorderCb();
  };

  return {
    draggedIndex,
    dragOverIndex,
    handleDragStart,
    handleDragEnd,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
  };
}
