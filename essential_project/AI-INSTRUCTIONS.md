# Instruções para IA - Análise e Utilização do BrasilitFieldTech

## Objetivo deste Documento

Este documento foi criado especificamente para orientar sistemas de IA na análise, compreensão e potencial modificação deste projeto. As diretrizes abaixo são estruturadas para maximizar a eficiência da interação entre a IA e o código fonte.

## Como Analisar o Projeto

### 1. Entendimento da Arquitetura

```
ESTRUTURA ESSENCIAL:
client/src/      - Frontend React (interface do usuário)
server/          - Backend Express (APIs e lógica de negócio)
shared/          - Schemas e tipos compartilhados (contratos de dados)
```

Para entender o fluxo do projeto, recomenda-se examinar na seguinte ordem:

1. `shared/schema.ts` - Definições centrais dos modelos de dados
2. `server/routes.ts` - Endpoints da API e suas implementações
3. `client/src/App.tsx` - Estrutura de roteamento da aplicação
4. `client/src/pages/` - Implementações de páginas individuais

### 2. Pontos de Entrada Principais

- Inicialização do servidor: `server/index.ts`
- Inicialização do cliente: `client/src/main.tsx`
- Definição de rotas frontend: `client/src/App.tsx`
- Definição de rotas backend: `server/routes.ts`

### 3. Padrões de Implementação

A aplicação segue padrões consistentes que podem ser identificados e reutilizados:

#### Formulários
```typescript
// Padrão para implementação de formulários
const form = useForm<TipoDoFormulario>({
  resolver: zodResolver(schemaDoFormulario),
  defaultValues: { ... }
});

// Submissão de formulário
const onSubmit = (data: TipoDoFormulario) => {
  // Lógica de envio
};
```

#### Consultas à API
```typescript
// Padrão para consultas de dados
const { data, isLoading } = useQuery({
  queryKey: ['/api/endpoint'],
  queryFn: getQueryFn({ on401: "returnNull" })
});

// Padrão para mutações
const mutation = useMutation({
  mutationFn: async (data: TipoDeDados) => {
    return await apiRequest('/api/endpoint', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['/api/endpoint'] });
  }
});
```

## Padrões de Esquemas de Dados

Os schemas Zod são centrais para a aplicação e seguem um padrão consistente:

```typescript
// Schema principal
export const tipoSchema = z.object({
  id: z.number(),
  // outros campos
});

// Schema para inserção (sem campos automáticos)
export const insertTipoSchema = tipoSchema.omit({ id: true });

// Type derivado do schema
export type Tipo = z.infer<typeof tipoSchema>;
export type InsertTipo = z.infer<typeof insertTipoSchema>;
```

## Diretrizes para Modificações

Ao modificar o código:

1. Sempre mantenha a sincronização entre os schemas em `shared/` e as implementações no cliente e servidor
2. Atualize tipos e interfaces quando adicionar ou remover campos de modelos de dados
3. Adicione novas rotas no arquivo `server/routes.ts` e as correspondentes em `client/src/App.tsx`
4. Utilize os hooks e utilitários existentes em `client/src/hooks/` e `client/src/lib/`
5. Mantenha a consistência de nomeação de arquivos e funções com o padrão existente

## Otimizações para Análise Automatizada

Para análise eficiente por sistemas de IA:

1. A estrutura de pastas segue convenções claras (components, hooks, pages)
2. Os nomes de arquivos são descritivos e indicam sua funcionalidade
3. As interfaces e tipos principais estão definidos em arquivos dedicados
4. Os componentes seguem um padrão consistente de implementação de props e hooks

## Componentes Prontos para Reuso

A aplicação possui componentes UI reaproveitáveis em:
- `client/src/components/ui/` - Componentes básicos (botões, inputs, etc)
- `client/src/components/` - Componentes de negócio específicos

## Nota sobre o Sistema de Storage

O sistema usa uma implementação em memória por padrão (`MemStorage`), mas a interface `IStorage` pode ser implementada com qualquer solução de banco de dados. As alterações devem ser feitas apenas em `server/storage.ts` mantendo a interface.

## Glossário de Termos do Domínio

- **Visit**: Visita técnica realizada por um técnico/inspetor
- **Report**: Relatório gerado após uma visita
- **FAR**: Formulário de Análise de Reclamação, um tipo específico de relatório
- **Inspeção**: Processo de verificação técnica de telhas e instalações
- **Vistoria**: Termo usado para descrever o processo completo de inspeção e relatório