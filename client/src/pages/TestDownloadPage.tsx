import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { downloadBlob, createUniqueFileName, DOCX_MIME_TYPE } from '@/lib/docDownloadUtils';

export default function TestDownloadPage() {
  const [isLoading, setIsLoading] = useState(false);

  // Função para criar um documento DOCX básico usando a biblioteca docx
  const createBasicDocx = async (): Promise<Blob> => {
    console.log("Criando documento DOCX com a biblioteca docx");
    
    // Criar um documento DOCX simples
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "Este é um documento DOCX de teste.",
                bold: true,
                size: 28
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Criado com a biblioteca 'docx' para testar o download.",
                size: 24
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Se você está vendo este documento, o download funcionou com sucesso!",
                italics: true,
                size: 24
              }),
            ],
          }),
        ],
      }],
    });

    try {
      // Usar o método correto para navegador: toBlobAsync em vez de toBuffer
      // Este método é compatível com navegadores
      const blob = await Packer.toBlob(doc);
      console.log("Documento DOCX criado com sucesso");
      return blob;
    } catch (error) {
      console.error("Erro ao gerar blob:", error);
      
      // Se falhar com toBlob, tentar métodos alternativos
      try {
        // Método alternativo usando Blob diretamente
        const arrayBuffer = await Packer.toBase64String(doc);
        const binaryString = window.atob(arrayBuffer);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        return new Blob([bytes], { type: DOCX_MIME_TYPE });
      } catch (secondError) {
        console.error("Erro em método alternativo:", secondError);
        throw error;
      }
    }
  };

  // Método de download usando createObjectURL
  const downloadWithCreateObjectURL = async () => {
    try {
      setIsLoading(true);
      toast.info("Gerando arquivo de teste...");

      const blob = await createBasicDocx();
      const fileName = "teste-download.docx";

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
      const fileName = "teste-download-filesaver.docx";

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
      const fileName = "teste-download-redirect.docx";

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
  
  // Método de download usando a função de utilidade avançada
  const downloadWithUtility = async () => {
    try {
      setIsLoading(true);
      toast.info("Gerando arquivo de teste com método avançado...");

      const blob = await createBasicDocx();
      const fileName = createUniqueFileName("teste-download-util", "docx");

      // Usar a função de utilidade avançada
      console.log("Usando utilitário avançado para download:", fileName);
      const success = await downloadBlob(blob, fileName);
      
      if (success) {
        toast.success("Arquivo gerado com método avançado!");
      } else {
        toast.error("Falha em todos os métodos de download");
      }
    } catch (error) {
      console.error("Erro com método avançado:", error);
      toast.error(`Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Método 5: Download via API do servidor
  const downloadWithServerAPI = async () => {
    try {
      setIsLoading(true);
      toast.info("Enviando documento para o servidor...");

      const blob = await createBasicDocx();
      const fileName = createUniqueFileName("server-download", "docx");
      
      // Converter o blob para Base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const base64 = reader.result as string;
          // Remover o prefixo "data:application/...;base64," para obter apenas o conteúdo Base64
          const base64Data = base64.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(blob);
      });
      
      const base64 = await base64Promise;
      console.log("Documento convertido para Base64, enviando para o servidor...");
      
      // Enviar para o servidor
      const response = await fetch('/api/download-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          docBuffer: base64,
          fileName,
          mimeType: blob.type
        }),
      });
      
      if (response.ok) {
        // Baixar a resposta
        const responseBlob = await response.blob();
        saveAs(responseBlob, fileName);
        console.log("Download via servidor concluído com sucesso");
        toast.success("Download via servidor bem-sucedido!");
      } else {
        throw new Error(`Servidor retornou: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("Erro no download via servidor:", error);
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
        
        <div className="p-4 border bg-blue-50 rounded-lg">
          <h2 className="text-lg font-medium mb-2">Método 4: Utilidade Avançada</h2>
          <p className="mb-4 text-gray-700">Usa nossa nova função utilitária com múltiplos fallbacks</p>
          <Button 
            onClick={downloadWithUtility}
            disabled={isLoading}
            className="w-full"
            variant="default"
          >
            Testar Download com Utilitário Avançado
          </Button>
        </div>
        
        <div className="p-4 border bg-green-50 rounded-lg">
          <h2 className="text-lg font-medium mb-2">Método 5: Download via API</h2>
          <p className="mb-4 text-gray-700">Usa o servidor como intermediário para o download</p>
          <Button 
            onClick={downloadWithServerAPI}
            disabled={isLoading}
            className="w-full"
            variant="destructive"
          >
            Testar Download via Servidor
          </Button>
        </div>
      </div>
    </div>
  );
}