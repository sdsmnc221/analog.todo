export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
  editable: boolean;
}

export type TodoStatus = "active" | "completed" | "all";
