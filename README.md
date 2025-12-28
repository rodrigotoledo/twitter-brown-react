# Twitter Clone - Frontend (React)

Interface web desenvolvida com React, TypeScript e Vite para o clone do Twitter.

## 🚀 Tecnologias

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query + Context API
- **Testing**: Vitest
- **Containerização**: Docker

## 📋 Funcionalidades

- ✅ Autenticação completa (JWT)
- ✅ Feed de tweets em tempo real
- ✅ Criar e publicar tweets
- ✅ Sistema de likes/dislikes
- ✅ Comentários em tweets
- ✅ Sistema de retweets
- ✅ Interface responsiva
- ✅ Tema dark/light
- ✅ Navegação SPA

## 🛠️ Desenvolvimento com Docker

### Iniciar Ambiente
```bash
# Usando orquestração raiz (recomendado)
cd ..
docker-compose --profile dev up --build

# Ou standalone
docker-compose up --build
```

### Comandos Úteis
```bash
# Ver logs
docker-compose logs -f frontend

# Acessar container
docker-compose exec frontend sh

# Build para produção
docker-compose build
```

### Desenvolvimento Local
```bash
npm install
npm run dev
```

## 🚀 Produção com Docker

### Deploy
```bash
# Build otimizado com Nginx
docker-compose build --no-cache

# Executar
docker-compose up -d

# Verificar se está rodando
curl http://localhost
```

### Build Manual
```bash
# Build otimizado
npm run build

# Servir com Nginx/Apache
```

### Variáveis de Ambiente
```bash
# Desenvolvimento
VITE_API_URL=http://localhost:3000

# Produção
VITE_API_URL=https://api.twitter-clone.com
```

## 🎨 UI/UX

### Design System
- **Framework CSS**: Tailwind CSS
- **Tema**: Dark/Light mode
- **Responsividade**: Mobile-first
- **Animações**: CSS transitions

### Componentes
- **TweetCard**: Exibição de tweets
- **TweetForm**: Criação de tweets
- **PostActions**: Likes, retweets, comentários
- **SideBar**: Navegação lateral
- **TopBar**: Barra superior

## 📁 Estrutura

```
src/
├── components/        # Componentes reutilizáveis
├── context/          # Context API (Auth, Posts)
├── pages/            # Páginas da aplicação
├── hooks/            # Custom hooks
├── utils/            # Utilitários
└── index.tsx         # Ponto de entrada
```

## 🔧 Scripts

```bash
npm run dev          # Desenvolvimento (porta 5173)
npm run build        # Build produção
npm run preview      # Preview da build
npm run test         # Executar testes
npm run lint         # Linting
```

## 🌐 API Integration

### Cliente HTTP
- **TanStack Query**: Gerenciamento de estado assíncrono
- **Context API**: Estado global (usuário, posts)
- **JWT**: Autenticação automática

### Endpoints Consumidos
- `/auth/*` - Autenticação
- `/tweets/*` - CRUD de tweets
- `/users/*` - Perfil de usuários

## 📄 Licença

MIT
