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

3. **Set up your environment variables according to the .env.example file, and add the environment variables available in item 7**

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

## To Run the Tests

1. **Complete all the RUN steps**

2. **Navigate to the API directory:**

   ```bash
   cd .\packages\api\
   ```

3. **Run the command:**

   ```bash
   pnpm test-coverage
   ```

4. **Run the tests via the graphical interface:**
   ```bash
   pnpm test-ui
   ```
