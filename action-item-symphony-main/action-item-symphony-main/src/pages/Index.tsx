
import React from 'react';
import { TodoProvider } from '@/contexts/TodoContext';
import TodoInput from '@/components/TodoInput';
import TodoList from '@/components/TodoList';
import TodoFilter from '@/components/TodoFilter';
import { CheckCircle2 } from 'lucide-react';

const Index: React.FC = () => {
  return (
    <TodoProvider>
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/50 px-4 py-16">
        <div className="container max-w-3xl mx-auto">
          <header className="text-center mb-10 animate-fade-in">
            <div className="inline-flex items-center justify-center p-2 mb-3">
              <CheckCircle2 className="h-8 w-8 text-primary mr-2" />
            </div>
            <h1 className="text-3xl font-medium tracking-tight mb-2">
              Elegantly Simple Todo
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              A beautiful, minimal task manager inspired by simplicity and focused on user experience.
            </p>
          </header>

          <main className="space-y-6 pb-20">
            <TodoInput />
            <TodoFilter />
            <TodoList />
          </main>
        </div>
      </div>
    </TodoProvider>
  );
};

export default Index;
