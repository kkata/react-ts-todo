import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

interface Todo {
  id: string;
  value: string;
  isDone: boolean;
  isRemoved: boolean;
}

type Filter = "all" | "checked" | "unchecked" | "removed";

const App = () => {
  const [text, setText] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>("all");

  const filterdTodo = todos.filter((todo) => {
    switch (filter) {
      case "all":
        return !todo.isRemoved;
      case "checked":
        return todo.isDone && !todo.isRemoved;
      case "unchecked":
        return !todo.isDone && !todo.isRemoved;
      case "removed":
        return todo.isRemoved;
      default:
        return todo;
    }
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (!text) return;

    const newTodo: Todo = {
      id: uuidv4(),
      value: text,
      isDone: false,
      isRemoved: false,
    };
    setTodos((prevTodos) => [newTodo, ...prevTodos]);
    setText("");
  };

  const handleEdit = (event: React.FormEvent<HTMLInputElement>) => {
    const id = event.currentTarget.dataset.todoId;
    const val = event.currentTarget.value;

    setTodos((prevTodos) => {
      return prevTodos.map((todo) => {
        return todo.id === id ? { ...todo, value: val } : todo;
      });
    });
  };

  const handleDone = (event: React.FormEvent<HTMLInputElement>) => {
    const id = event.currentTarget.dataset.todoId;

    setTodos((prevTodos) => {
      return prevTodos.map((todo) => {
        return todo.id === id ? { ...todo, isDone: !todo.isDone } : todo;
      });
    });
  };

  const handleRemove = (event: React.FormEvent<HTMLButtonElement>) => {
    const id = event.currentTarget.dataset.todoId;
    setTodos((prevTodos) => {
      return prevTodos.map((todo) => {
        return todo.id === id ? { ...todo, isRemoved: !todo.isRemoved } : todo;
      });
    });
  };

  const handleFilter = (event: React.FormEvent<HTMLSelectElement>) => {
    const targetValue = event.currentTarget.value as Filter;
    setFilter(targetValue);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={filter === "checked" || filter === "removed"}
        />
        <button disabled={filter === "checked" || filter === "removed"}>
          追加
        </button>
      </form>
      <select defaultValue="all" onChange={handleFilter}>
        <option value="all">すべてのタスク</option>
        <option value="checked">完了したタスク</option>
        <option value="unchecked">未完了のタスク</option>
        <option value="removed">削除済みのタスク</option>
      </select>
      <ul>
        {filterdTodo.map((todo) => {
          return (
            <li key={todo.id}>
              <input
                type="checkbox"
                checked={todo.isDone}
                onChange={handleDone}
                data-todo-id={todo.id}
                disabled={todo.isRemoved}
              />
              <input
                type="text"
                disabled={todo.isDone || todo.isRemoved}
                value={todo.value}
                onChange={handleEdit}
                data-todo-id={todo.id}
              />
              <button onClick={handleRemove} data-todo-id={todo.id}>
                {todo.isRemoved ? "復元" : "削除"}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default App;
