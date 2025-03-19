
import React from 'react';
import { useTodo } from '@/contexts/TodoContext';
import TodoItem from './TodoItem';
import { ClipboardList } from 'lucide-react';

const TodoList: React.FC = () => {
  const { filteredTodos, filter } = useTodo();

  if (filteredTodos.length === 0) {
    return (
      <div className="min-h-[300px] flex flex-col items-center justify-center text-center p-6 rounded-lg bg-muted/30 border border-border animate-fade-in">
        <ClipboardList className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
        <h3 className="text-lg font-medium text-foreground mb-1">No tasks found</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          {filter.status === 'all' && filter.category === 'all'
            ? "Your task list is empty. Add your first task to get started!"
            : "No tasks match your current filters. Try changing your filter settings or add a new task."}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto space-y-3">
      {filteredTodos.map((todo, index) => (
        <div 
          key={todo.id} 
          style={{ 
            animationDelay: `${index * 50}ms`,
            opacity: 0,
            animation: 'slide-in 0.4s ease-out forwards'
          }}
        >
          <TodoItem todo={todo} />
        </div>
      ))}
    </div>
  );
};

export default TodoList;
