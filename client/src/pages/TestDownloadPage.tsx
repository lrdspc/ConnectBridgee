import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';
import { saveAs } from 'file-saver';

export default function TestDownloadPage() {
  const [isLoading, setIsLoading] = useState(false);

  // Função para criar um documento DOCX básico
  const createBasicDocx = async (): Promise<Blob> => {
    // Criar um arquivo de texto simples
    const text = 'Este é um arquivo de teste básico.';
    const blob = new Blob([text], { type: 'text/plain' });
    return blob;
  };

  // Método de download usando createObjectURL
  const downloadWithCreateObjectURL = async () => {
    try {
      setIsLoading(true);
      toast.info("Gerando arquivo de teste...");

      const blob = await createBasicDocx();
      const fileName = "teste-download.txt";

      // Método usando createObjectURL
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      console.log("Download iniciado:", fileName);
      
      // Limpar recursos
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);

      toast.success("Arquivo gerado com sucesso!");
    } catch (error) {
      console.error("Erro:", error);
      toast.error(`Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Método de download usando FileSaver
  const downloadWithFileSaver = async () => {
    try {
      setIsLoading(true);
      toast.info("Gerando arquivo de teste com FileSaver...");

      const blob = await createBasicDocx();
      const fileName = "teste-download-filesaver.txt";

      // Usar FileSaver
      saveAs(blob, fileName);
      console.log("Download iniciado com FileSaver:", fileName);

      toast.success("Arquivo gerado com FileSaver!");
    } catch (error) {
      console.error("Erro com FileSaver:", error);
      toast.error(`Erro com FileSaver: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Método de download enviando para o servidor e fazendo download
  const downloadWithServerRedirect = async () => {
    try {
      setIsLoading(true);
      toast.info("Tentando método alternativo via abertura em nova aba...");

      const blob = await createBasicDocx();
      const fileName = "teste-download-redirect.txt";

      // Criar URL temporária e abrir em nova aba
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      console.log("Nova aba aberta com o conteúdo:", fileName);
      
      // Limpar recursos
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);

      toast.success("Arquivo aberto em nova aba!");
    } catch (error) {
      console.error("Erro com redirecionamento:", error);
      toast.error(`Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Página de Teste de Download</h1>
      <div className="space-y-4">
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-medium mb-2">Método 1: createObjectURL</h2>
          <p className="mb-4 text-gray-700">Usa o método nativo do navegador</p>
          <Button 
            onClick={downloadWithCreateObjectURL}
            disabled={isLoading}
            className="w-full"
          >
            Testar Download com createObjectURL
          </Button>
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-medium mb-2">Método 2: FileSaver</h2>
          <p className="mb-4 text-gray-700">Usa a biblioteca FileSaver.js</p>
          <Button 
            onClick={downloadWithFileSaver}
            disabled={isLoading}
            className="w-full"
            variant="outline"
          >
            Testar Download com FileSaver
          </Button>
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-medium mb-2">Método 3: Nova Aba</h2>
          <p className="mb-4 text-gray-700">Abre o conteúdo em uma nova aba</p>
          <Button 
            onClick={downloadWithServerRedirect}
            disabled={isLoading}
            className="w-full"
            variant="secondary"
          >
            Testar Abertura em Nova Aba
          </Button>
        </div>
      </div>
    </div>
  );
}