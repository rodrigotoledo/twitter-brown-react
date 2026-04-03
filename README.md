# Twitter Clone - Frontend

Frontend React + Vite com ambiente de desenvolvimento simplificado em Docker.

## Arquivos de ambiente

Use `.env` para configurar o frontend:

```env
VITE_API_URL=http://localhost:3001
```

## Subir em desenvolvimento

```bash
docker compose up --build
```

App disponível em `http://localhost:3000`.

## Comandos úteis

```bash
docker compose logs -f frontend
docker compose exec frontend sh
docker compose down
```

## Observações

- O `Dockerfile` e o `compose.yml` são voltados apenas para desenvolvimento.
- Hot reload foi mantido com bind mount do projeto e polling de arquivos.
- O `compose.yml` usa o `.env` local e monta o projeto inteiro dentro do container.
