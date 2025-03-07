import { Link, useLocation } from "wouter";
import { 
  Home, 
  Users,
  ClipboardCheck, 
  Plus, 
  FileText,
  User,
  Settings,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const BottomNavigation = () => {
  const [location] = useLocation();
  const { logout } = useAuth();

  const isActive = (path: string) => {
    return location === path || (path !== '/' && location.startsWith(path));
  };

  // Links para navegação inferior
  const navLinks = [
    { name: 'Início', path: '/', icon: <Home className="h-5 w-5" /> },
    { name: 'Clientes', path: '/clientes', icon: <Users className="h-5 w-5" /> },
    { name: 'Visitas', path: '/visitas', icon: <ClipboardCheck className="h-5 w-5" /> },
    { name: 'Relatórios', path: '/relatorios', icon: <FileText className="h-5 w-5" /> },
    { name: 'Perfil', path: '/perfil', icon: <User className="h-5 w-5" /> },
    { name: 'Config.', path: '/configuracoes', icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Barra principal */}
      <nav className="bg-white border-t border-gray-200 shadow py-2 px-1">
        <div className="grid grid-cols-6 relative">
          {/* Links laterais */}
          {navLinks.map((link, index) => (
            <Link key={link.path} href={link.path}>
              <a className={cn(
                "flex flex-col items-center justify-center transition-colors py-1",
                isActive(link.path) ? "text-primary" : "text-gray-500 hover:text-gray-800"
              )}>
                <div className={cn(
                  "p-1 rounded-full",
                  isActive(link.path) ? "bg-primary/10" : ""
                )}>
                  {link.icon}
                </div>
                <span className="text-[9px] mt-1 font-medium">{link.name}</span>
                {isActive(link.path) && (
                  <div className="w-1 h-1 bg-primary rounded-full mt-0.5"></div>
                )}
              </a>
            </Link>
          ))}

          {/* Botão central flutuante - Nova Vistoria */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-6">
            <Link href="/nova-vistoria">
              <a className="flex flex-col items-center">
                <div className="bg-primary text-white p-3 rounded-full shadow-lg flex items-center justify-center w-14 h-14 active:scale-95 transition-transform">
                  <Plus className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-semibold mt-1 text-primary">Nova Vistoria</span>
              </a>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default BottomNavigation;
