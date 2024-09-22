# Divide.ae

## Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/BrunoRRamos/Divide.ae.git
   cd divide.ae
   ```

2. **Install packages:**
   ```bash
   pnpm i
   ```

3. **Set up your env variables according to the .env.example file**
<br>

4. **Execute Prisma migrations**
   ```bash
   pnpm migrate

   ```

5. **Run 🚀**
   ```bash
   pnpm dev
   ```

--------

## Para executar os testes

1. **Realizar todos os passos de RUN**
<br>

2. **Ir para o diretorio da API:**
   ```bash
   cd .\packages\api\
   ```
<br>

3. **Executar o comando:**
   ```bash
   pnpm test-coverage
   ```

4. **Executar os teste via interface grafica:**
   ```bash
   pnpm test-ui
   ```