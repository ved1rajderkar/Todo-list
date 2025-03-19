
import React from 'react';
import { useTodo, type TodoCategory } from '@/contexts/TodoContext';
import { Button } from '@/components/ui/button';
import { ListFilter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const TodoFilter: React.FC = () => {
  const { filter, setFilter, todos } = useTodo();
  
  // Count tasks for each status and category
  const counts = {
    status: {
      all: todos.length,
      active: todos.filter(todo => !todo.completed).length,
      completed: todos.filter(todo => todo.completed).length,
    },
    category: {} as Record<TodoCategory | 'all', number>
  };
  
  // Initialize 'all' category count
  counts.category.all = todos.length;
  
  // Count tasks for each category
  todos.forEach(todo => {
    counts.category[todo.category] = (counts.category[todo.category] || 0) + 1;
  });
  
  return (
    <div className="w-full max-w-xl mx-auto mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Select
          value={filter.status}
          onValueChange={(value) => setFilter({ status: value as any })}
        >
          <SelectTrigger className="w-[120px] h-8 text-sm bg-background border border-border">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All tasks ({counts.status.all})</SelectItem>
            <SelectItem value="active">Active ({counts.status.active})</SelectItem>
            <SelectItem value="completed">Completed ({counts.status.completed})</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-sm">
            <ListFilter className="h-3.5 w-3.5" />
            <span>Category</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2" align="end">
          <div className="grid gap-1">
            {(['all', 'personal', 'work', 'shopping', 'health', 'other'] as const).map((category) => (
              <Button
                key={category}
                variant={filter.category === category ? "default" : "ghost"}
                size="sm"
                className="justify-start font-normal"
                onClick={() => setFilter({ category })}
              >
                <span>{category === 'all' ? 'All categories' : category.charAt(0).toUpperCase() + category.slice(1)}</span>
                <span className="ml-auto text-xs">
                  {counts.category[category] || 0}
                </span>
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TodoFilter;
