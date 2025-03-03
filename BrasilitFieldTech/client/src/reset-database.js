import { initializeDevDatabase } from './lib/db';

// Força a reinicialização do banco de dados
initializeDevDatabase();
console.log('Banco de dados reinicializado com sucesso');