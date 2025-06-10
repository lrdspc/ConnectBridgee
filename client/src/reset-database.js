import { db, initializeDevDatabase } from './lib/db';

async function resetDatabase() {
  try {
    console.log('Iniciando limpeza completa do banco de dados...');
    
    // Fechamos conexões atuais
    await db.close();
    
    // Deletar completamente o banco
    await window.indexedDB.deleteDatabase('brasilit');
    
    console.log('Banco de dados limpo com sucesso.');
    
    // Aguardar um pouco para garantir que o banco foi deletado
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Reinicializar o banco com dados de exemplo
    await initializeDevDatabase();
    
    console.log('Banco de dados reinicializado com dados de exemplo.');
    
    // Recarregar a página para aplicar as mudanças
    window.location.reload();
  } catch (error) {
    console.error('Erro ao resetar o banco de dados:', error);
  }
}

// Inicia o processo de reset
resetDatabase();