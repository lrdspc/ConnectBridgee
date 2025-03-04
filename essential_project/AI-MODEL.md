# Modelo para IA - BrasilitFieldTech

Este documento fornece informações estruturadas sobre o projeto específicas para sistemas de IA, em um formato otimizado para processamento por LLMs.

## Estrutura de Propriedades de Entidades

### Entidade: Usuário (User)
```json
{
  "id": "number",
  "name": "string",
  "email": "string",
  "role": "string",
  "passwordHash": "string",
  "createdAt": "string (ISO date)",
  "updatedAt": "string (ISO date)"
}
```

### Entidade: Visita (Visit)
```json
{
  "id": "number",
  "userId": "number",
  "clientName": "string",
  "address": "string",
  "date": "string (ISO date)",
  "time": "string (optional)",
  "type": "enum ('installation', 'maintenance', 'inspection', 'repair', 'emergency')",
  "status": "enum ('scheduled', 'in-progress', 'pending', 'completed', 'urgent')",
  "priority": "enum ('normal', 'high', 'urgent')",
  "description": "string (optional)",
  "contactInfo": "string (optional)",
  "checklist": "ChecklistItem[] (optional)",
  "photos": "VisitPhoto[] (optional)",
  "documents": "VisitDocument[] (optional)",
  "notes": "string (optional)",
  "createdAt": "string (ISO date)",
  "updatedAt": "string (ISO date)",
  "completedAt": "string (ISO date) (optional)"
}
```

### Entidade: Relatório (Report)
```json
{
  "id": "number",
  "visitId": "number (optional)",
  "userId": "number",
  "title": "string",
  "type": "enum ('inspection', 'maintenance', 'repair', 'installation')",
  "status": "enum ('draft', 'completed', 'approved', 'rejected')",
  "content": "object (JSON)",
  "attachments": "ReportAttachment[] (optional)",
  "createdAt": "string (ISO date)",
  "updatedAt": "string (ISO date)",
  "approvedAt": "string (ISO date) (optional)",
  "sharedWith": "SharedInfo[] (optional)"
}
```

### Sub-Entidade: Item de Checklist (ChecklistItem)
```json
{
  "id": "string",
  "text": "string",
  "description": "string (optional)",
  "completed": "boolean"
}
```

### Sub-Entidade: Foto da Visita (VisitPhoto)
```json
{
  "id": "string",
  "dataUrl": "string",
  "timestamp": "string (ISO date)",
  "notes": "string (optional)"
}
```

### Sub-Entidade: Documento de Visita (VisitDocument)
```json
{
  "id": "string",
  "name": "string",
  "type": "string",
  "dataUrl": "string",
  "timestamp": "string (ISO date)"
}
```

### Sub-Entidade: Anexo de Relatório (ReportAttachment)
```json
{
  "id": "string",
  "name": "string",
  "type": "string",
  "url": "string",
  "size": "number (optional)",
  "createdAt": "string (ISO date)"
}
```

## Relacionamentos entre Entidades

1. **Usuário -> Visitas**: Um usuário pode ter múltiplas visitas (1:N)
2. **Visita -> Relatório**: Uma visita pode ter um relatório associado (1:1)
3. **Usuário -> Relatórios**: Um usuário pode criar múltiplos relatórios (1:N)

## Endpoints da API

### Autenticação
- `POST /api/auth/login`: Autentica um usuário
- `POST /api/auth/logout`: Encerra a sessão de um usuário
- `GET /api/auth/me`: Obtém informações do usuário atual

### Visitas
- `GET /api/visits`: Lista todas as visitas
- `GET /api/visits/:id`: Obtém detalhes de uma visita específica
- `POST /api/visits`: Cria uma nova visita
- `PATCH /api/visits/:id`: Atualiza uma visita existente
- `DELETE /api/visits/:id`: Remove uma visita
- `POST /api/visits/sync`: Sincroniza visitas offline
- `GET /api/visits/sync`: Obtém visitas para sincronização

### Relatórios
- `GET /api/reports`: Lista todos os relatórios
- `GET /api/reports/:id`: Obtém um relatório específico
- `POST /api/reports`: Cria um novo relatório
- `PATCH /api/reports/:id`: Atualiza um relatório existente
- `DELETE /api/reports/:id`: Remove um relatório
- `POST /api/reports/:id/share`: Compartilha um relatório

## Exemplos de Código para Operações Comuns

### Consultar Visitas
```typescript
const { data: visits, isLoading } = useQuery({
  queryKey: ['/api/visits'],
  queryFn: getQueryFn({ on401: "throw" })
});
```

### Criar uma Nova Visita
```typescript
const mutation = useMutation({
  mutationFn: async (visitData: InsertVisit) => {
    return await apiRequest('/api/visits', {
      method: 'POST',
      body: JSON.stringify(visitData)
    });
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['/api/visits'] });
    toast({
      title: "Visita criada com sucesso",
      variant: "success"
    });
  }
});

// Uso:
mutation.mutate(newVisitData);
```

### Atualizar uma Visita
```typescript
const mutation = useMutation({
  mutationFn: async (visitData: { id: number, updates: Partial<Visit> }) => {
    return await apiRequest(`/api/visits/${visitData.id}`, {
      method: 'PATCH',
      body: JSON.stringify(visitData.updates)
    });
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['/api/visits'] });
  }
});

// Uso:
mutation.mutate({ id: 1, updates: { status: 'completed' } });
```

### Gerar um Relatório
```typescript
async function generateReport(visit: Visit) {
  try {
    const blob = await generateVisitReport(visit);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatório-visita-${visit.id}.docx`;
    link.click();
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    toast({
      title: "Erro ao gerar relatório",
      description: "Ocorreu um erro durante a geração do relatório",
      variant: "destructive"
    });
  }
}
```

## Estados de Aplicação

### Estados do Usuário
1. **Não autenticado**: Usuário não fez login
2. **Autenticado**: Usuário com sessão ativa
3. **Sessão expirada**: Sessão do usuário expirou

### Estados de Conectividade
1. **Online**: Aplicação com acesso à internet
2. **Offline**: Aplicação sem acesso à internet
3. **Sincronizando**: Aplicação enviando/recebendo dados

### Estados de Visita
1. **Agendada**: Visita planejada mas não iniciada
2. **Em progresso**: Visita iniciada
3. **Pendente**: Visita com seguimentos pendentes
4. **Concluída**: Visita finalizada
5. **Urgente**: Visita de alta prioridade

### Estados de Relatório
1. **Rascunho**: Relatório em processo de criação
2. **Concluído**: Relatório finalizado
3. **Aprovado**: Relatório aprovado por supervisor
4. **Rejeitado**: Relatório que necessita de correções

## Padrões de Design Comuns

1. **Layout Principal**: DashboardLayout com sidebar e área de conteúdo
2. **Cartões de Informação**: Cards com header, conteúdo e ações
3. **Formulários**: Form com validação e feedback de erro
4. **Listas**: Listas com filtragem, ordenação e paginação
5. **Modais**: Diálogos para ações confirmativas ou formulários compactos