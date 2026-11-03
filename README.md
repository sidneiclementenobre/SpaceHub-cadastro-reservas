# SpaceHub – Conectando Lugares e Pessoas 🚀

> **Projeto Full-Stack desenvolvido como critério de avaliação para vaga de Residência/Estágio Tecnológico.** O SpaceHub é uma plataforma completa inspirada no ecossistema de economia compartilhada (estilo Airbnb), permitindo o gerenciamento de imóveis, controle de disponibilidade e reserva de espaços em tempo real sem conflito de agendas.

---

## 🛠️ Tecnologias e Arquitetura

O projeto foi construído utilizando o padrão **Clean Architecture**, dividindo as responsabilidades de forma isolada e garantindo a resiliência com tipagem estática e persistência distribuída na nuvem.

### Backend & Banco de Dados
* **Runtime:** Node.js v20+ com TypeScript (Garantia de resiliência e validação).
* **Framework:** Express.js (Engine de rotas e middlewares RESTful).
* **Banco de Dados:** PostgreSQL hospedado na nuvem via **Supabase**.
* **Driver de Conexão:** `pg` (Pool de conexões seguras com suporte SSL).

### Segurança e Criptografia
* **Autenticação:** JWT (*JSON Web Tokens*) com tempo de expiração de 24h.
* **Segurança de Dados:** Criptografia unidirecional com hashing via **Bcrypt** para armazenamento seguro de senhas.
* **Proteção contra IDOR:** Middlewares customizados interceptando requisições privadas.

### Frontend
* Interface minimalista, responsiva (*Mobile-First*) construída puramente com **HTML5, CSS3 estruturado e JavaScript Vanilla (ES6+)**, consumindo a API interna de forma assíncrona (`fetch` com async/await).

---

## 🧠 Regras de Negócio & Algoritmos Críticos

### 🛑 O Motor Antiduplicação de Agenda (Prevenção de Overbooking)
O núcleo do sistema impede matematicamente que duas reservas sejam efetuadas no mesmo período para o mesmo imóvel. O algoritmo valida o conflito antes de salvar a transação no banco utilizando a lógica de interseção de intervalos de datas:

\[\text{Conflito} = (\text{CheckIn}_{\text{Novo}} < \text{CheckOut}_{\text{Existente}}) \ \mathbf{AND}\ (\text{CheckOut}_{\text{Novo}} > \text{CheckIn}_{\text{Existente}})\]

```typescript
// Query SQL implementada no modelo de dados (bookingModel.ts)
const query = `
  SELECT COUNT(*) FROM bookings
  WHERE space_id = $1
    AND check_in < $3
    AND check_out > $2;
`;
```

---

## 📂 Estrutura de Pastas (Clean Architecture)

```text
spacehub-backend/
├── src/
│   ├── config/          # Instância do Pool de conexão com o Supabase (SSL)
│   ├── controllers/     # Regras de fluxo e tratamento de requisições
│   ├── middlewares/     # Validação de Tokens JWT e proteção contra IDOR
│   ├── models/          # Modelagem de dados e queries SQL estruturadas
│   ├── routes/          # Definição e proteção dos endpoints RESTful
│   └── app.ts           # Inicialização do servidor Express e arquivos estáticos
├── public/              # Interface Web (Frontend integrado)
│   └── index.html       # SPA Consumidora da API
├── .env                 # Variáveis de ambiente locais (Ignorado pelo Git)
├── .gitignore           # Filtro de segurança para arquivos privados
├── package.json         # Manifesto e scripts de execução
└── tsconfig.json        # Configurações do compilador TypeScript
```

---

## 🚀 Como Executar o Projeto Localmente

1. **Clonar o Repositório:**
   ```bash
   git clone https://github.com.git
   cd spacehub-residencia/spacehub-backend
   ```

2. **Instalar Dependências:**
   ```bash
   npm install
   ```

3. **Configurar as Variáveis de Ambiente:**
   Crie um arquivo `.env` na raiz do diretório e insira suas credenciais do Supabase:
   ```env
   PORT=3000
   DATABASE_URL=postgresql://postgres:sua_senha@db.id_supabase.supabase.co:5432/postgres
   JWT_SECRET=sua_chave_secreta_jwt
   ```

4. **Rodar em Ambiente de Desenvolvimento:**
   ```bash
   npm run dev
   ```
   O servidor iniciará automaticamente em `http://localhost:3000`.

---

## 🎯 Checklist de Critérios de Aceite Atendidos

* [x] **Marco 1:** Banco de dados relacional persistente com relacionamentos 1:N reais (Users, Spaces, Bookings).
* [x] **Marco 2:** Senhas 100% criptografadas no banco com Bcrypt e rotas bloqueadas via JWT.
* [x] **Marco 3:** Algoritmo impeditivo de *double booking* funcionando com validação lógica direto no banco.
* [x] **Marco 4:** Interface Full-Stack responsiva unificada servida de forma estática pelo Node.js e hospedada em nuvem pública (Render).
