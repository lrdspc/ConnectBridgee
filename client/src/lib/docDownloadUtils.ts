/**
 * Utilitários para download de documentos com múltiplas abordagens de fallback
 * para garantir compatibilidade com diferentes navegadores e ambientes
 */

/**
 * Faz o download de um blob como arquivo, tentando múltiplos métodos
 * para garantir compatibilidade com diferentes navegadores
 */
export async function downloadBlob(blob: Blob, fileName: string): Promise<boolean> {
  console.log("[docDownloadUtils] Tentando download:", fileName);
  
  // Verificar se o FileSaver está disponível
  let successFileSaver = false;
  try {
    const { saveAs } = await import('file-saver');
    if (typeof saveAs === 'function') {
      console.log("[docDownloadUtils] Método 1: FileSaver");
      saveAs(blob, fileName);
      successFileSaver = true;
      return true;
    }
  } catch (error) {
    console.error("[docDownloadUtils] Erro ao usar FileSaver:", error);
    successFileSaver = false;
  }
  
  // Se FileSaver falhar, tentar método nativo
  if (!successFileSaver) {
    try {
      console.log("[docDownloadUtils] Método 2: URL.createObjectURL");
      const url = URL.createObjectURL(blob);
      
      // Usar um frame invisível para evitar bloqueios de popups
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      
      // Criar link dentro do iframe
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.innerHTML = 'Download ' + fileName;
      
      // Adicionar ao iframe e clicar
      iframe.contentDocument?.body.appendChild(link);
      link.click();
      
      // Limpar recursos com um pequeno delay
      setTimeout(() => {
        URL.revokeObjectURL(url);
        document.body.removeChild(iframe);
      }, 1000);
      
      return true;
    } catch (error) {
      console.error("[docDownloadUtils] Erro no método nativo:", error);
    }
  }
  
  // Terceira opção: abrir em nova aba
  try {
    console.log("[docDownloadUtils] Método 3: Abrir em nova aba");
    const url = URL.createObjectURL(blob);
    const newWindow = window.open(url, '_blank');
    
    // Se falhar ao abrir nova aba
    if (!newWindow) {
      console.warn("[docDownloadUtils] Não foi possível abrir nova aba, tentando redirecionamento");
      window.location.href = url;
    }
    
    // Limpar recursos
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
    
    return true;
  } catch (error) {
    console.error("[docDownloadUtils] Todos os métodos falharam:", error);
    return false;
  }
}

/**
 * Fornece o tipo MIME correto para arquivos DOCX
 */
export const DOCX_MIME_TYPE = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

/**
 * Cria um nome de arquivo com timestamp único para evitar problemas de cache
 */
export function createUniqueFileName(baseName: string, extension: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `${baseName}-${timestamp}.${extension}`;
}