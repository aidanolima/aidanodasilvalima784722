# Estágio 1: Build
FROM node:20-alpine AS build

WORKDIR /app

# Copia arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código
COPY . .

# Gera o build de produção (Vite gera a pasta /dist)
RUN npm run build

# Estágio 2: Produção (Servidor Nginx)
FROM nginx:alpine

# Copia o build do estágio anterior para a pasta do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copia uma configuração customizada do Nginx (opcional, mas recomendado)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]