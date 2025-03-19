import React, { useState } from 'react';
import { useTodo, type TodoCategory } from '@/contexts/TodoContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TodoInput: React.FC = () => {
  const { addTodo } = useTodo();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TodoCategory>('other');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      addTodo(title, description, category);
      setTitle('');
      setDescription('');
      // Keep the category as is for convenient repeat entries
      if (!isExpanded) {
        setIsExpanded(false);
      }
    }
  };

  const handleFocus = () => {
    setIsExpanded(true);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="w-full max-w-xl mx-auto glass-container rounded-xl p-4 shadow-sm mb-6 transition-all duration-300 ease-in-out"
    >
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={handleFocus}
            className="flex-1 border-none bg-transparent text-base placeholder:text-muted-foreground/70 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all duration-300"
            autoFocus
          />
          <Button 
            type="submit" 
            size="sm" 
            className="rounded-full px-3 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <PlusCircle className="h-5 w-5" />
            <span className="sr-only">Add Task</span>
          </Button>
        </div>

        {isExpanded && (
          <div className="animate-slide-in space-y-3 pt-2">
            <Textarea
              placeholder="Add details (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-24 resize-none border-none bg-transparent text-sm placeholder:text-muted-foreground/70 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Category:</span>
                <Select
                  value={category}
                  onValueChange={(value) => setCategory(value as TodoCategory)}
                >
                  <SelectTrigger className="w-[140px] h-8 text-sm border-none bg-secondary/50">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="work">Work</SelectItem>
                    <SelectItem value="shopping">Shopping</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsExpanded(false)}
                className="text-xs h-7"
              >
                Collapse
              </Button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export default TodoInput;
