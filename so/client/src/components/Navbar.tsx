import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, User, Settings, LogOut, FileText, Home, Clipboard, Users } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <nav className="bg-primary text-primary-foreground shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <a className="flex items-center space-x-2">
                  <img
                    className="h-8 w-auto"
                    src="/brasilit-logo-white.svg"
                    alt="Brasilit Logo"
                  />
                  <span className="font-bold text-lg hidden sm:block">
                    Brasilit
                  </span>
                </a>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              <Link href="/">
                <a
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive("/")
                      ? "bg-primary-dark text-white"
                      : "hover:bg-primary-dark/70"
                  }`}
                >
                  Dashboard
                </a>
              </Link>
              <Link href="/visitas">
                <a
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive("/visitas")
                      ? "bg-primary-dark text-white"
                      : "hover:bg-primary-dark/70"
                  }`}
                >
                  Visitas
                </a>
              </Link>
              <Link href="/relatorios">
                <a
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive("/relatorios")
                      ? "bg-primary-dark text-white"
                      : "hover:bg-primary-dark/70"
                  }`}
                >
                  Relatórios
                </a>
              </Link>
              <Link href="/clientes">
                <a
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive("/clientes")
                      ? "bg-primary-dark text-white"
                      : "hover:bg-primary-dark/70"
                  }`}
                >
                  Clientes
                </a>
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="ml-3 relative flex items-center space-x-3">
                <Link href="/perfil">
                  <a className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-dark/70">
                    <User className="h-4 w-4" />
                    <span>{user.name}</span>
                  </a>
                </Link>
                <Link href="/configuracoes">
                  <a className="p-2 rounded-md hover:bg-primary-dark/70">
                    <Settings className="h-5 w-5" />
                  </a>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-md hover:bg-primary-dark/70"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link href="/login">
                <a className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-dark/70">
                  Login
                </a>
              </Link>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-primary-dark/70 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Abrir menu principal</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu móvel */}
      <div className={`${isOpen ? "block" : "hidden"} sm:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link href="/">
            <a
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                isActive("/")
                  ? "bg-primary-dark text-white"
                  : "hover:bg-primary-dark/70"
              }`}
              onClick={closeMenu}
            >
              <Home className="h-5 w-5" />
              <span>Dashboard</span>
            </a>
          </Link>
          <Link href="/visitas">
            <a
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                isActive("/visitas")
                  ? "bg-primary-dark text-white"
                  : "hover:bg-primary-dark/70"
              }`}
              onClick={closeMenu}
            >
              <Clipboard className="h-5 w-5" />
              <span>Visitas</span>
            </a>
          </Link>
          <Link href="/relatorios">
            <a
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                isActive("/relatorios")
                  ? "bg-primary-dark text-white"
                  : "hover:bg-primary-dark/70"
              }`}
              onClick={closeMenu}
            >
              <FileText className="h-5 w-5" />
              <span>Relatórios</span>
            </a>
          </Link>
          <Link href="/clientes">
            <a
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                isActive("/clientes")
                  ? "bg-primary-dark text-white"
                  : "hover:bg-primary-dark/70"
              }`}
              onClick={closeMenu}
            >
              <Users className="h-5 w-5" />
              <span>Clientes</span>
            </a>
          </Link>
        </div>
        <div className="pt-4 pb-3 border-t border-primary-dark/20">
          {user ? (
            <div className="px-2 space-y-1">
              <div className="flex items-center px-3 py-2">
                <div className="flex-shrink-0">
                  {user.photoUrl ? (
                    <img
                      className="h-10 w-10 rounded-full"
                      src={user.photoUrl}
                      alt={user.name}
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-primary-dark flex items-center justify-center">
                      <span className="text-lg font-medium text-white">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium">{user.name}</div>
                  <div className="text-sm opacity-80">{user.email}</div>
                </div>
              </div>
              <Link href="/perfil">
                <a
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium hover:bg-primary-dark/70"
                  onClick={closeMenu}
                >
                  <User className="h-5 w-5" />
                  <span>Perfil</span>
                </a>
              </Link>
              <Link href="/configuracoes">
                <a
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium hover:bg-primary-dark/70"
                  onClick={closeMenu}
                >
                  <Settings className="h-5 w-5" />
                  <span>Configurações</span>
                </a>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium hover:bg-primary-dark/70 text-left"
              >
                <LogOut className="h-5 w-5" />
                <span>Sair</span>
              </button>
            </div>
          ) : (
            <div className="px-2">
              <Link href="/login">
                <a
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-dark/70"
                  onClick={closeMenu}
                >
                  Login
                </a>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}