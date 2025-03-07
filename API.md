# Documentação da API BrasilitAI

Este documento descreve os endpoints da API REST do BrasilitAI e como usá-los.

## Base URL

```
https://api.brasilit.ai/v1
```

Para desenvolvimento local:

```
http://localhost:5000
```

## Autenticação

A API usa autenticação baseada em sessão para proteger os endpoints.

### Login

```
POST /api/auth/login
```

**Corpo da requisição**:

```json
{
  "username": "string",
  "password": "string"
}
```

**Resposta de sucesso**:

```json
{
  "id": 1,
  "name": "Nome do Usuário",
  "email": "usuario@exemplo.com",
  "role": "technician"
}
```

### Logout

```
POST /api/auth/logout
```

**Resposta de sucesso**:

```json
{
  "success": true,
  "message": "Logout successful"
}
```

### Obter usuário atual

```
GET /api/auth/me
```

**Resposta de sucesso**:

```json
{
  "id": 1,
  "name": "Nome do Usuário",
  "email": "usuario@exemplo.com",
  "role": "technician"
}
```

## Visitas

### Listar visitas

```
GET /api/visits
```

**Parâmetros de consulta**:

- `userId` (opcional): Filtrar por ID de usuário
- `filter` (opcional): Filtrar por status da visita

**Resposta de sucesso**:

```json
[
  {
    "id": 1,
    "clientName": "Cliente Exemplo",
    "address": "Rua Exemplo, 123",
    "date": "2025-03-10",
    "time": "14:00",
    "type": "installation",
    "status": "scheduled",
    "priority": "normal",
    "description": "Instalação de novo telhado",
    "createdAt": "2025-03-07T10:00:00Z",
    "updatedAt": "2025-03-07T10:00:00Z"
  }
]
```

### Obter visita por ID

```
GET /api/visits/:id
```

**Resposta de sucesso**:

```json
{
  "id": 1,
  "clientName": "Cliente Exemplo",
  "address": "Rua Exemplo, 123",
  "date": "2025-03-10",
  "time": "14:00",
  "type": "installation",
  "status": "scheduled",
  "priority": "normal",
  "description": "Instalação de novo telhado",
  "contactInfo": "+5511999999999",
  "checklist": [
    {
      "id": "1",
      "text": "Verificar materiais",
      "completed": false
    }
  ],
  "photos": [],
  "documents": [],
  "notes": "",
  "createdAt": "2025-03-07T10:00:00Z",
  "updatedAt": "2025-03-07T10:00:00Z"
}
```

### Criar visita

```
POST /api/visits
```

**Corpo da requisição**:

```json
{
  "clientName": "Cliente Novo",
  "address": "Rua Nova, 456",
  "date": "2025-03-15",
  "time": "10:00",
  "type": "inspection",
  "priority": "high",
  "description": "Inspeção de telhado após temporal",
  "contactInfo": "+5511888888888"
}
```

**Resposta de sucesso**:

```json
{
  "id": 2,
  "clientName": "Cliente Novo",
  "address": "Rua Nova, 456",
  "date": "2025-03-15",
  "time": "10:00",
  "type": "inspection",
  "status": "scheduled",
  "priority": "high",
  "description": "Inspeção de telhado após temporal",
  "contactInfo": "+5511888888888",
  "checklist": [],
  "photos": [],
  "documents": [],
  "notes": "",
  "createdAt": "2025-03-07T11:00:00Z",
  "updatedAt": "2025-03-07T11:00:00Z"
}
```

### Atualizar visita

```
PATCH /api/visits/:id
```

**Corpo da requisição** (campos a serem atualizados):

```json
{
  "status": "in-progress",
  "notes": "Cliente não estava no local, remarcado para amanhã"
}
```

**Resposta de sucesso**:

```json
{
  "id": 2,
  "clientName": "Cliente Novo",
  "address": "Rua Nova, 456",
  "date": "2025-03-15",
  "time": "10:00",
  "type": "inspection",
  "status": "in-progress",
  "priority": "high",
  "description": "Inspeção de telhado após temporal",
  "contactInfo": "+5511888888888",
  "checklist": [],
  "photos": [],
  "documents": [],
  "notes": "Cliente não estava no local, remarcado para amanhã",
  "createdAt": "2025-03-07T11:00:00Z",
  "updatedAt": "2025-03-07T12:00:00Z"
}
```

### Excluir visita

```
DELETE /api/visits/:id
```

**Resposta de sucesso**:

```json
{
  "success": true,
  "message": "Visit deleted successfully"
}
```

## Relatórios

### Listar relatórios

```
GET /api/reports
```

**Parâmetros de consulta**:

- `userId` (opcional): Filtrar por ID de usuário
- `filter` (opcional): Filtrar por tipo de relatório

**Resposta de sucesso**:

```json
[
  {
    "id": 1,
    "title": "Relatório de Vistoria Técnica",
    "type": "inspection",
    "status": "draft",
    "content": {},
    "createdAt": "2025-03-07T14:00:00Z",
    "updatedAt": "2025-03-07T14:00:00Z",
    "userId": 1,
    "visitId": 2
  }
]
```

### Obter relatório por ID

```
GET /api/reports/:id
```

**Resposta de sucesso**:

```json
{
  "id": 1,
  "title": "Relatório de Vistoria Técnica",
  "type": "inspection",
  "status": "draft",
  "content": {
    "clientName": "Cliente Novo",
    "address": "Rua Nova, 456",
    "date": "2025-03-15",
    "observations": "Telhado com vazamento localizado"
  },
  "createdAt": "2025-03-07T14:00:00Z",
  "updatedAt": "2025-03-07T14:00:00Z",
  "userId": 1,
  "visitId": 2
}
```

### Criar relatório

```
POST /api/reports
```

**Corpo da requisição**:

```json
{
  "title": "Relatório de Vistoria Técnica",
  "type": "inspection",
  "content": {
    "clientName": "Cliente Novo",
    "address": "Rua Nova, 456",
    "date": "2025-03-15",
    "observations": "Telhado com vazamento localizado"
  },
  "visitId": 2
}
```

**Resposta de sucesso**:

```json
{
  "id": 1,
  "title": "Relatório de Vistoria Técnica",
  "type": "inspection",
  "status": "draft",
  "content": {
    "clientName": "Cliente Novo",
    "address": "Rua Nova, 456",
    "date": "2025-03-15",
    "observations": "Telhado com vazamento localizado"
  },
  "createdAt": "2025-03-07T14:00:00Z",
  "updatedAt": "2025-03-07T14:00:00Z",
  "userId": 1,
  "visitId": 2
}
```

### Atualizar relatório

```
PATCH /api/reports/:id
```

**Corpo da requisição** (campos a serem atualizados):

```json
{
  "status": "completed",
  "content": {
    "clientName": "Cliente Novo",
    "address": "Rua Nova, 456",
    "date": "2025-03-15",
    "observations": "Telhado com vazamento localizado na área sul, recomendada substituição de 3 telhas"
  }
}
```

**Resposta de sucesso**:

```json
{
  "id": 1,
  "title": "Relatório de Vistoria Técnica",
  "type": "inspection",
  "status": "completed",
  "content": {
    "clientName": "Cliente Novo",
    "address": "Rua Nova, 456",
    "date": "2025-03-15",
    "observations": "Telhado com vazamento localizado na área sul, recomendada substituição de 3 telhas"
  },
  "createdAt": "2025-03-07T14:00:00Z",
  "updatedAt": "2025-03-07T15:00:00Z",
  "userId": 1,
  "visitId": 2
}
```

### Excluir relatório

```
DELETE /api/reports/:id
```

**Resposta de sucesso**:

```json
{
  "success": true,
  "message": "Report deleted successfully"
}
```

## Desempenho

### Obter desempenho semanal

```
GET /api/performance/:userId
```

**Resposta de sucesso**:

```json
[
  {
    "day": "2025-03-01",
    "visits": 5,
    "timeSpent": 360,
    "efficiency": 85
  },
  {
    "day": "2025-03-02",
    "visits": 3,
    "timeSpent": 240,
    "efficiency": 78
  }
]
```

### Atualizar desempenho diário

```
PATCH /api/performance/:userId/:day
```

**Corpo da requisição**:

```json
{
  "visits": 6,
  "timeSpent": 390,
  "efficiency": 87
}
```

**Resposta de sucesso**:

```json
{
  "day": "2025-03-01",
  "visits": 6,
  "timeSpent": 390,
  "efficiency": 87
}
```

## Códigos de Erro

- `400 Bad Request`: Dados de requisição inválidos ou ausentes
- `401 Unauthorized`: Autenticação necessária
- `403 Forbidden`: Sem permissão para acessar o recurso
- `404 Not Found`: Recurso não encontrado
- `500 Internal Server Error`: Erro interno do servidor