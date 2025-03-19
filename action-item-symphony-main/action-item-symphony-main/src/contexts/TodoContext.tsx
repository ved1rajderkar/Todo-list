
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";

export type TodoCategory = 'personal' | 'work' | 'shopping' | 'health' | 'other';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  category: TodoCategory;
  createdAt: Date;
}

interface TodoContextType {
  todos: Todo[];
  filter: {
    status: 'all' | 'active' | 'completed';
    category: TodoCategory | 'all';
  };
  addTodo: (title: string, description?: string, category?: TodoCategory) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  editTodo: (id: string, data: Partial<Omit<Todo, 'id' | 'createdAt'>>) => void;
  setFilter: (filter: Partial<TodoContextType['filter']>) => void;
  filteredTodos: Todo[];
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        // Parse stored todos and convert string dates back to Date objects
        return JSON.parse(savedTodos).map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt)
        }));
      } catch (error) {
        console.error('Error parsing todos from localStorage:', error);
        return [];
      }
    }
    return [];
  });

  const [filter, setFilterState] = useState<TodoContextType['filter']>({
    status: 'all',
    category: 'all'
  });

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (title: string, description?: string, category: TodoCategory = 'other') => {
    if (!title.trim()) return;
    
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description?.trim(),
      completed: false,
      category,
      createdAt: new Date()
    };
    
    setTodos(prev => [newTodo, ...prev]);
    
    toast.success("Task added successfully");
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => 
      prev.map(todo => 
        todo.id === id 
          ? { ...todo, completed: !todo.completed } 
          : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
    toast.success("Task removed");
  };

  const editTodo = (id: string, data: Partial<Omit<Todo, 'id' | 'createdAt'>>) => {
    setTodos(prev => 
      prev.map(todo => 
        todo.id === id 
          ? { ...todo, ...data } 
          : todo
      )
    );
    toast.success("Task updated");
  };

  const setFilter = (newFilter: Partial<TodoContextType['filter']>) => {
    setFilterState(prev => ({ ...prev, ...newFilter }));
  };

  // Filter todos based on current filter settings
  const filteredTodos = todos.filter(todo => {
    // Filter by status
    if (filter.status === 'active' && todo.completed) return false;
    if (filter.status === 'completed' && !todo.completed) return false;
    
    // Filter by category
    if (filter.category !== 'all' && todo.category !== filter.category) return false;
    
    return true;
  });

  return (
    <TodoContext.Provider 
      value={{ 
        todos, 
        filter,
        filteredTodos,
        addTodo, 
        toggleTodo, 
        deleteTodo, 
        editTodo,
        setFilter
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
};
