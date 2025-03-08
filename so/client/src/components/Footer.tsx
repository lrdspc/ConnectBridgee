import { Link } from "wouter";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="hidden md:block bg-gray-100 border-t border-gray-200 py-4 text-sm text-gray-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p>
              &copy; {currentYear} Brasilit - Sistema de Relatórios Técnicos. Todos os direitos reservados.
            </p>
          </div>
          <div className="flex space-x-6">
            <Link href="/sobre">
              <a className="hover:text-primary">Sobre</a>
            </Link>
            <Link href="/ajuda">
              <a className="hover:text-primary">Ajuda</a>
            </Link>
            <Link href="/termos">
              <a className="hover:text-primary">Termos</a>
            </Link>
            <Link href="/privacidade">
              <a className="hover:text-primary">Privacidade</a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}