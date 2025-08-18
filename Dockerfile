# Etapa 1: Construção da aplicação
FROM node:18 AS builder

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos do projeto
COPY package.json package-lock.json ./

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos
COPY . .

# Gera o build da aplicação Next.js
RUN npm run build

# Etapa 2: Servir a aplicação em produção
FROM node:18 AS runner

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos necessários da etapa de build
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/node_modules node_modules

# Define a porta exposta
EXPOSE 10000

# Comando para iniciar o servidor Next.js
CMD ["npm", "run", "start"]