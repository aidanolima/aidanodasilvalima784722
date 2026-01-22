# Pet Admin

# aidanodasilvalima78472261468
> **Projeto FrontEnd da Avaliação SEPLAG-MT:** PetAdmin - Sistema de Gestão e Prontuário Digital Veterinário
> **Versão:** 1.0.0 © 2026 PetManager Gov - By ÁIdano Lima
> **Status:** Iniciado (Versão com a estrutura inicial do projeto e configurações de ambiente)

O **Pet Admin** é um painel de administração senior desenvolvido para gerenciar pets e seus tutores de forma centralizada. O sistema permite a visualização, criação, edição e exclusão de registros, focando na integridade dos dados e na rastreabilidade dos vínculos entre animais e responsáveis.

## 🚀 Diferenciais Técnicos e Evolução

Para atender aos critérios de **escalabilidade** e **manutenibilidade** do edital, o projeto implementa:

* **Vínculos Dinâmicos:** Sistema robusto de associação entre Tutores e Pets, permitindo a gestão de prontuários complexos diretamente na ficha do responsável.
* **Busca Global e Paginação:** Busca reativa no servidor que varre toda a base de dados (não apenas a página atual), sincronizada com paginação dinâmica para alta performance.
* **Tipagem Estrita (TypeScript):** Uso de *Union Types* (PetEspecie) para garantir que diversas espécies (Aves, Peixes, Exóticos, etc.) sejam tratadas de forma segura.
* **Máscaras e Validações:** Implementação de máscaras de entrada (ex: Telefone com 9 dígitos) e validações rígidas para garantir a qualidade dos dados inseridos.

## 🛠️ Funcionalidades

* **Autenticação de Usuário:** Sistema de login seguro para acesso ao painel administrativo.
* **Gerenciamento de Tutores:**
    * Listagem paginada e detalhamento completo de cada tutor.
    * CRUD completo (Criar, Visualizar, Editar e Excluir).
    * Vínculo direto com a lista de pets na ficha do tutor.
* **Gerenciamento de Pets:**
    * Suporte a múltiplas espécies (Cachorro, Gato, Aves, Peixes, Pequenos Mamíferos, Exóticos).
    * Upload de fotos de identificação com controle de *multipart/form-data*.
    * Busca inteligente por nome ou raça em toda a base.
* **Interface Responsiva:** Layout moderno com Tailwind CSS que se adapta a diferentes tamanhos de tela.

## 🧰 Tecnologias Utilizadas

*   **Frontend:**
    *   [React](https://react.dev/)
    *   [TypeScript](https://www.typescriptlang.org/)
    *   [Vite](https://vitejs.dev/)
    *   [Tailwind CSS](https://tailwindcss.com/)
    *   [React Router](https://reactrouter.com/)
    *   [Axios](https://axios-http.com/)
    *   [Lucide React](https://lucide.dev/guide/packages/lucide-react)
    *   [React Toastify](https://fkhadra.github.io/react-toastify/introduction)
*   **Testes:**
    *   [Vitest](https://vitest.dev/)
    *   [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
*   **Linting:**
    *   [ESLint](https://eslint.org/)
*   **Deployment:**
    *   [Docker](https://www.docker.com/)
    *   [Nginx](https://www.nginx.com/)

## Começando

Em breve mais informações e evoluções...

### Pré-requisitos

*   [Node.js](https://nodejs.org/en/) (versão 20 ou superior)
*   [npm](https://www.npmjs.com/)

### Instalação

1.  Clone o repositório:
    ```bash
    git clone https://github.com/seu-usuario/pet-admin.git
    ```
2.  Navegue até o diretório do projeto:
    ```bash
    cd pet-admin
    ```
3.  Instale as dependências:
    ```bash
    npm install
    ```

### Executando a Aplicação

Para iniciar o servidor de desenvolvimento, execute:

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

## Scripts Disponíveis

*   `npm run dev`: Inicia o servidor de desenvolvimento.
*   `npm run build`: Compila a aplicação para produção.
*   `npm run lint`: Executa o linter para verificar erros de código.
*   `npm run preview`: Inicia um servidor de pré-visualização da build de produção.
*   `npm run test`: Executa os testes.
*   `npm run test:watch`: Executa os testes em modo de observação.
*   `npm run test:coverage`: Gera um relatório de cobertura de testes.
*   `npm run test:ui`: Inicia a interface de usuário do Vitest.

## Estrutura do Projeto

```
pet-admin/
├── .dockerignore
├── .gitignore
├── Dockerfile
├── eslint.config.js
├── index.html
├── nginx.conf
├── package.json
├── README.md
├── tsconfig.json
├── vite.config.ts
├── public/
│   └── vite.svg
└── src/
    ├── api/
    │   └── axiosInstance.ts
    ├── assets/
    │   └── react.svg
    ├── components/
    ├── contexts/
    │   └── AuthContext.tsx
    ├── hooks/
    ├── layouts/
    │   └── MainLayout.tsx
    ├── pages/
    │   ├── auth/
    │   │   └── Login.tsx
    │   ├── pets/
    │   └── tutors/
    ├── services/
    │   ├── api.ts
    │   ├── authService.ts
    │   ├── petService.ts
    │   └── tutorService.ts
    ├── types/
    │   └── index.ts
    └── utils/
        └── index.ts
```

## Deployment

O projeto está configurado para ser implantado com o Docker. Para construir a imagem Docker, execute:

```bash
docker build -t pet-admin .
docker run -d -p 80:80 pet-admin
```

Para executar o container, .DockerFile execute:

```bash
docker run -d -p 80:80 pet-admin
```

