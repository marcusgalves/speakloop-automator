# Usa uma imagem base do Node.js
FROM node:18-alpine

# Instala o http-server globalmente
RUN npm install -g http-server

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos do seu site para o contêiner
COPY . .

# Expõe a porta 8080 (porta padrão do http-server)
EXPOSE 8080

# Inicia o servidor HTTP
CMD ["http-server", "-p", "8080"]
