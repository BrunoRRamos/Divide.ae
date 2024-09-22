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

3. **Set up your environment variables according to the .env.example file, and add the environment variables available in item 7.**

4. **In the root of /apps/expo, adjust your .env file with the environment variables available in item 7 of the document**

5. **With Docker already installed on your machine, run the following command:**

   ```bash
   docker compose up -d
   ```

6. **Run Prisma migrations**

   ```bash
   pnpm db:migrate
   ```

7. **Run 🚀**
   ```bash
   pnpm dev
   ```

---

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
