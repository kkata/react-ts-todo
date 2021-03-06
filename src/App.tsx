import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import localforage from "localforage";

import {
  Container,
  List,
  ListItem,
  Input,
  Button,
  Select,
  Checkbox,
  Flex,
  Spacer,
  Center,
  VStack,
  Heading,
} from "@chakra-ui/react";

interface Todo {
  id: string;
  value: string;
  isDone: boolean;
  isRemoved: boolean;
}

type Filter = "all" | "done" | "unchecked" | "removed";

const APP_KEY = "appTaskManagement";

const App = () => {
  const [text, setText] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  async function fetchData() {
    try {
      const value = await localforage.getItem<Todo[]>(APP_KEY);
      // console.log(value);
      if (value) {
        setTodos(value);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    localforage.setItem(APP_KEY, todos);
  }, [todos]);

  const filterdTodo = todos.filter((todo) => {
    switch (filter) {
      case "all":
        return !todo.isRemoved;
      case "done":
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
    const id = event.currentTarget.id;
    const checked = event.currentTarget.checked;

    setTodos((prevTodos) => {
      return prevTodos.map((todo) => {
        return todo.id === id ? { ...todo, isDone: checked } : todo;
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
    <Container maxW="container.md">
      <VStack spacing={5} align="stretch" p="10">
        <Heading as="h1" size="xl" isTruncated>
          Task Management
        </Heading>
        <form onSubmit={handleSubmit}>
          <Flex>
            <Input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={filter === "done" || filter === "removed"}
              placeholder="????????????????????????????????????"
            />
            <Center w="150px">
              <Button
                type="submit"
                disabled={filter === "done" || filter === "removed"}
              >
                ??????
              </Button>
            </Center>
          </Flex>
        </form>

        <Select defaultValue="all" onChange={handleFilter}>
          <option value="all">?????????????????????</option>
          <option value="done">?????????????????????</option>
          <option value="unchecked">?????????????????????</option>
          <option value="removed">????????????????????????</option>
        </Select>

        <List spacing="20px">
          {filterdTodo.map((todo) => {
            return (
              <ListItem key={todo.id}>
                <Flex>
                  <Center w="50px">
                    <Checkbox
                      isChecked={todo.isDone}
                      onChange={handleDone}
                      id={todo.id}
                      isDisabled={todo.isRemoved}
                    />
                  </Center>
                  <Input
                    type="text"
                    disabled={todo.isRemoved}
                    value={todo.value}
                    onChange={handleEdit}
                    data-todo-id={todo.id}
                  />
                  <Spacer />
                  <Center w="150px">
                    <Button onClick={handleRemove} data-todo-id={todo.id}>
                      {todo.isRemoved ? "??????" : "??????"}
                    </Button>
                  </Center>
                </Flex>
              </ListItem>
            );
          })}
        </List>
      </VStack>
    </Container>
  );
};

export default App;
