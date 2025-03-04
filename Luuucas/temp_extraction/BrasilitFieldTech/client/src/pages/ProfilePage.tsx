import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import Header from "../components/layout/Header";
import { syncData } from "../lib/sync";
import { useOfflineStatus } from "../hooks/useOfflineStatus";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { User, LogOut, RefreshCw, Database, Mail, Phone, MapPin, Briefcase, HelpCircle, RotateCcw } from "lucide-react";

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { isOffline } = useOfflineStatus();
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleSync = async () => {
    if (isOffline) {
      toast({
        title: "Offline",
        description: "Você está offline. Conecte-se à internet para sincronizar.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSyncing(true);
    
    try {
      await syncData();
      
      toast({
        title: "Sincronização concluída",
        description: "Todos os dados foram sincronizados com sucesso!",
      });
    } catch (error) {
      console.error("Sync error:", error);
      
      toast({
        title: "Erro na sincronização",
        description: "Ocorreu um erro ao sincronizar os dados. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };
  
  // Função para resetar dados do tutorial e boas-vindas
  const handleResetOnboarding = () => {
    setIsResetting(true);
    
    try {
      // Remove as flags do localStorage
      localStorage.removeItem('has-seen-tutorial');
      
      toast({
        title: "Recursos redefinidos",
        description: "O tutorial e a mensagem de boas-vindas foram redefinidos com sucesso!",
      });
    } catch (error) {
      console.error("Reset error:", error);
      
      toast({
        title: "Erro na redefinição",
        description: "Ocorreu um erro ao redefinir os recursos. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };
  
  // Função para reabrir o tutorial
  const handleShowTutorial = () => {
    // Voltar para a página inicial e mostrar o tutorial
    window.location.href = "/?show-tutorial=true";
  };

  return (
    <div className="page page-transition" id="profile">
      <Header title="Perfil" showBackButton={true} />
      
      <div className="p-4">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4">
          <div className="bg-primary h-24 relative">
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
              <div className="bg-white rounded-full p-2">
                <div className="h-28 w-28 rounded-full bg-neutral-200 flex items-center justify-center overflow-hidden border-4 border-white">
                  {user?.photoUrl ? (
                    <img 
                      src={user.photoUrl} 
                      alt={user.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-12 w-12 text-neutral-400" />
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-20 pb-5 px-4 text-center">
            <h2 className="text-xl font-bold">{user?.name || "Técnico"}</h2>
            <p className="text-neutral-600 mt-1">{user?.role || "Técnico de Campo"}</p>
          </div>
        </div>
        
        <Card className="mb-4">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-3">Informações de Contato</h3>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-neutral-500 mr-3" />
                <div>
                  <p className="text-sm text-neutral-700">{user?.email || "email@brasilit.com.br"}</p>
                  <p className="text-xs text-neutral-500">Email</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-neutral-500 mr-3" />
                <div>
                  <p className="text-sm text-neutral-700">(11) 98765-4321</p>
                  <p className="text-xs text-neutral-500">Telefone</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-neutral-500 mr-3" />
                <div>
                  <p className="text-sm text-neutral-700">São Paulo, SP</p>
                  <p className="text-xs text-neutral-500">Região</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Briefcase className="h-5 w-5 text-neutral-500 mr-3" />
                <div>
                  <p className="text-sm text-neutral-700">ID: {user?.id || "T-12345"}</p>
                  <p className="text-xs text-neutral-500">Matrícula</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-3">Configurações</h3>
            
            <div className="space-y-3">
              <Button 
                variant="outline"
                className="w-full justify-start"
                onClick={handleSync}
                disabled={isSyncing || isOffline}
              >
                <RefreshCw className={`h-5 w-5 mr-3 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? "Sincronizando..." : "Sincronizar Dados"}
              </Button>
              
              <Button 
                variant="outline"
                className="w-full justify-start"
              >
                <Database className="h-5 w-5 mr-3" />
                Limpar Cache Local
              </Button>
              
              <Button 
                variant="outline"
                className="w-full justify-start"
                onClick={handleResetOnboarding}
                disabled={isResetting}
              >
                <RotateCcw className={`h-5 w-5 mr-3 ${isResetting ? 'animate-spin' : ''}`} />
                {isResetting ? "Redefinindo..." : "Redefinir Tutorial e Boas-vindas"}
              </Button>
              
              <Button 
                variant="outline"
                className="w-full justify-start"
                onClick={handleShowTutorial}
              >
                <HelpCircle className="h-5 w-5 mr-3" />
                Ver Tutorial Novamente
              </Button>
              
              <Button 
                variant="outline"
                className="w-full justify-start"
              >
                <User className="h-5 w-5 mr-3" />
                Editar Perfil
              </Button>
              
              <Button 
                variant="destructive"
                className="w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 mr-3" />
                Sair
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center text-xs text-neutral-500 mb-8">
          <p>Brasilit Técnico v1.0.0</p>
          <p className="mt-1">© {new Date().getFullYear()} Brasilit | Todos os direitos reservados</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
