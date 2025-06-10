import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const LoginPage = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await login.mutateAsync({ username, password });
      
      toast({
        title: "Login realizado",
        description: "Bem-vindo ao Brasilit Técnico!",
      });
    } catch (error) {
      console.error("Login error:", error);
      
      toast({
        title: "Erro de autenticação",
        description: "Credenciais inválidas. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center p-4 bg-neutral-100">
      <div className="w-full max-w-md text-center mb-8">
        <div className="mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 40" className="w-48 h-20 mx-auto">
            <rect width="100" height="40" fill="#0057B8" rx="4" />
            <path d="M20 10 H80 V30 H20 Z" fill="#FF6B00" />
            <text x="50" y="25" fontSize="14" fontWeight="bold" textAnchor="middle" fill="white">BRASILIT</text>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-neutral-800">
          Brasilit Técnico
        </h1>
        <p className="text-neutral-600 mt-2">
          Entre com suas credenciais para acessar o sistema
        </p>
      </div>
      
      <Card className="w-full max-w-md p-6 bg-white rounded-xl shadow-lg">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuário</Label>
              <Input
                id="username"
                placeholder="Seu nome de usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </div>
        </form>
        
        {/* Development help message */}
        {import.meta.env.DEV && (
          <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">
            <div className="font-semibold mb-1">🧪 Ambiente de desenvolvimento</div>
            <p>Use qualquer nome de usuário e senha para entrar.</p>
          </div>
        )}
      </Card>
      
      <p className="mt-8 text-sm text-neutral-500">
        © {new Date().getFullYear()} Brasilit | Todos os direitos reservados
      </p>
    </div>
  );
};

export default LoginPage;
