import { ReactNode } from "react";
import { Link } from "wouter";

interface TestLayoutProps {
  children: ReactNode;
}

export function TestLayout({ children }: TestLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-blue-700 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">Brasilit - Área de Teste</h1>
          </div>
          <nav>
            <Link href="/">
              <a className="px-3 py-2 rounded hover:bg-blue-600">Voltar ao Sistema</a>
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4 pb-2 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-blue-800">Ambiente de Testes</h2>
              <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                Somente para Desenvolvimento
              </span>
            </div>
            <p className="text-gray-600 text-sm mt-1">
              Esta área é destinada apenas para testes e desenvolvimento de recursos.
            </p>
          </div>
          
          {children}
        </div>
      </main>
      
      <footer className="bg-gray-800 text-gray-300 p-4 text-center text-sm">
        <p>Brasilit Testes - {new Date().getFullYear()} - Ambiente de Desenvolvimento</p>
      </footer>
    </div>
  );
}