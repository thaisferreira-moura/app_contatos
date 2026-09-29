# App Contatos — Expo + TypeScript + Expo Router

Aplicativo didático de gerenciamento de contatos com autenticação JWT, SecureStore, CRUD e upload de imagens.

## API usada

https://api-contatos-auth-04-09-25.onrender.com

## Rotas utilizadas

- POST `/usuarios/registrar`
- POST `/usuarios/login`
- GET `/contatos`
- POST `/contatos`
- GET `/contatos/:id`
- PUT `/contatos/:id`
- DELETE `/contatos/:id`
- POST `/upload` com campo multipart `foto`
- GET `/upload/:id`

## Como executar

1. Instale Node.js LTS.
2. Entre na pasta do projeto.
3. Execute:

```bash
npm install
npx expo start
```

4. Abra o QR Code pelo Expo Go no celular.

## Importante

Este projeto utiliza `expo-secure-store`. Para o teste da atividade, use o Expo Go no Android/iOS. O fluxo solicitado não depende do modo Web.

## Fluxo

Cadastro → Login → JWT no SecureStore → Contatos → CRUD → Upload de foto.

## Estrutura

```text
app/
  _layout.tsx
  index.tsx
  cadastro.tsx
  contatos/
    index.tsx
    novo.tsx
    [id].tsx

components/
  FormContato.tsx

lib/
  api.ts

styles/
  global.ts

types/
  Contato.ts
```
