
import React, { useState } from 'react';
import { useTodo, type Todo, type TodoCategory } from '@/contexts/TodoContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Check, Trash2, Pencil, X, Save } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const { toggleTodo, deleteTodo, editTodo } = useTodo();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [editCategory, setEditCategory] = useState<TodoCategory>(todo.category);
  const [isExpanded, setIsExpanded] = useState(!!todo.description);

  const handleSave = () => {
    if (editTitle.trim()) {
      editTodo(todo.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
        category: editCategory
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setEditCategory(todo.category);
    setIsEditing(false);
  };

  const getCategoryColor = (category: TodoCategory) => {
    return {
      personal: 'bg-todo-personal text-blue-800',
      work: 'bg-todo-work text-red-800',
      shopping: 'bg-todo-shopping text-green-800',
      health: 'bg-todo-health text-purple-800',
      other: 'bg-todo-other text-amber-800'
    }[category];
  };

  // Format date for display
  const formatDate = (date: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date >= today) {
      return 'Today';
    } else if (date >= yesterday) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  if (isEditing) {
    return (
      <div className="animate-fade-in rounded-lg bg-background p-4 shadow-sm border border-border transition-all duration-300">
        <div className="space-y-3">
          <Input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="border-none bg-secondary/30 text-base focus-visible:ring-1"
            placeholder="Task title"
            autoFocus
          />
          
          <Textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="min-h-24 resize-none border-none bg-secondary/30 text-sm focus-visible:ring-1"
            placeholder="Add details (optional)"
          />
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Category:</span>
            <Select
              value={editCategory}
              onValueChange={(value) => setEditCategory(value as TodoCategory)}
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
          
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="h-8 px-3 text-xs"
            >
              <X className="mr-1 h-3 w-3" />
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              className="h-8 px-3 text-xs"
            >
              <Save className="mr-1 h-3 w-3" />
              Save
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "animate-slide-in group rounded-lg p-4 shadow-sm border transition-all duration-300",
        todo.completed 
          ? "bg-muted/30 border-border/50" 
          : "bg-background border-border hover:shadow-md"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 pt-0.5">
          <button
            type="button"
            onClick={() => toggleTodo(todo.id)}
            className={cn(
              "todo-checkbox flex h-5 w-5 items-center justify-center rounded-full border border-primary/30 transition-all duration-300",
              todo.completed ? "bg-primary border-primary" : "bg-transparent hover:border-primary"
            )}
            aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
          >
            {todo.completed && (
              <Check className="h-3 w-3 text-primary-foreground" />
            )}
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div 
              className={cn(
                "flex-1 text-base font-medium leading-tight transition-colors duration-300",
                todo.completed && "text-muted-foreground line-through"
              )}
            >
              {todo.title}
            </div>
            
            <div className="flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(true)}
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
              >
                <Pencil className="h-3.5 w-3.5" />
                <span className="sr-only">Edit</span>
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-[400px]">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete task</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this task? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteTodo(todo.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {todo.description && (
            <div className="mt-1.5">
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs text-muted-foreground hover:text-foreground focus:outline-none"
              >
                {isExpanded ? "Hide details" : "Show details"}
              </button>
              
              {isExpanded && (
                <div className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground animate-slide-in">
                  {todo.description}
                </div>
              )}
            </div>
          )}

          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">
              {formatDate(new Date(todo.createdAt))}
            </span>
            <span className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
              getCategoryColor(todo.category)
            )}>
              {todo.category.charAt(0).toUpperCase() + todo.category.slice(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;
