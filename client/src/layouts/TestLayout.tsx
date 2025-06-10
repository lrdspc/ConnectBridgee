import React, { ReactNode } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TestLayoutProps {
  children: ReactNode;
}

export function TestLayout({ children }: TestLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Barra de navegação simples */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-lg font-semibold">Ambiente de Teste</h1>
          </div>
          <div>
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Home className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Conteúdo principal */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Rodapé simples */}
      <footer className="py-4 px-6 border-t text-center text-sm text-muted-foreground">
        <p>Sistema de Teste - Brasilit © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}