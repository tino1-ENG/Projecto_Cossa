# MOZBID — Premium Online Auction Marketplace

> **Plataforma Web de Leilões Online de Prestígio em Moçambique**  
> **Moeda:** Metical (MZN — armazenado em centavos de Metical: 1 MZN = 100 centavos)  
> **Base de Dados:** SQLite nativo (`node:sqlite` em modo WAL, transações atómicas imediatas `BEGIN IMMEDIATE`, anti-sniping, proxy bidding)  
> **Backend:** Node.js (JavaScript / ESM), Express, Socket.IO, JWT, Bcrypt  
> **Frontend:** Quasar Framework + Vue 3, TypeScript, Pinia, Vue Router, Vite, Tailwind CSS, Obsidian Reserve Design System

---

## 1. Estrutura Profissional do Projeto

```
Projecto_Cossa/
├── backend/                       # Servidor Node.js & Base de Dados SQLite
│   ├── data/
│   │   └── mozbid.db             # Base de dados SQLite com WAL mode
│   ├── src/
│   │   ├── database/             # Schema SQL (15 tabelas), Migrações e Seeder
│   │   │   ├── db.js             # Conexão nativa node:sqlite e runTransaction
│   │   │   ├── schema.sql        # Tabelas, índices e triggers
│   │   │   ├── migrate.js        # Gestor de migrações
│   │   │   └── seed.js           # Seeder com leilões de luxo e utilizadores
│   │   ├── middleware/           # Autenticação JWT e RBAC (Buyer, Seller, Admin)
│   │   │   └── auth.js
│   │   ├── routes/               # Endpoints RESTful da API
│   │   │   ├── auth.js
│   │   │   ├── auctions.js
│   │   │   ├── categories.js
│   │   │   ├── buyer.js
│   │   │   ├── seller.js
│   │   │   ├── admin.js
│   │   │   └── orders.js
│   │   ├── sockets/              # Broadcast e eventos Socket.IO em tempo real
│   │   │   └── index.js
│   │   └── index.js              # Ponto de entrada do backend & Engine de expiração
│   ├── test-api.js               # Suite de 11 testes automatizados de integração
│   └── package.json
│
├── frontend/                      # Aplicação Web (Vue 3 + Quasar + Vite)
│   ├── src/
│   │   ├── components/           # Componentes Quasar & Obsidian Reserve
│   │   │   ├── auction/          # AuctionCard, BidPanel, AuctionTimer, ProductGallery
│   │   │   └── common/           # AppNavbar, AppFooter, ToastContainer
│   │   ├── layouts/              # PublicLayout, BuyerLayout, SellerLayout, AdminLayout
│   │   ├── pages/                # HomePage, CatalogPage, AuctionDetailsPage, HowItWorks
│   │   ├── stores/               # Pinia stores (auth, auction, notification)
│   │   ├── services/             # Axios API client e Socket.IO client
│   │   ├── css/                  # Estilos globais Obsidian Reserve e Tailwind
│   │   ├── quasar-variables.sass # Variáveis de marca do Quasar
│   │   ├── main.ts               # Setup Quasar Framework, Pinia e Router
│   │   └── App.vue
│   ├── index.html
│   ├── vite.config.ts            # Plugin Quasar e proxy de desenvolvimento
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── package.json
│
├── interfaces/                    # Especificações e referências originais de design
│   ├── DESIGN.md                 # Design System "Obsidian Reserve"
│   ├── code.html                 # Especificação HTML/CSS
│   └── screen.png                # Mockup de interface
│
├── package.json                   # Scripts unificados de orquestração
├── start-mozbid.ps1               # Script PowerShell para arranque direto
└── README.md
```

---

## 2. Comandos de Execução

Na raiz do projeto:

| Comando | Descrição |
| :--- | :--- |
| `npm run dev:backend` | Inicia o servidor Node.js em `http://localhost:5000` com reinicialização automática |
| `npm run dev:frontend` | Inicia o servidor Vite Quasar em `http://localhost:5173` |
| `npm run build:frontend` | Compila o frontend para produção (`dist/`) com verificação TypeScript |
| `npm run test` | Executa a suite de 11 testes automatizados no backend e base de dados SQLite |
| `npm run seed` | Repõe e preenche a base de dados com leilões realistas e utilizadores de teste |

---

## 3. Contas de Teste Pré-Configuradas

| Papel | Email | Palavra-passe | Perfil |
| :--- | :--- | :--- | :--- |
| **Comprador** | `mariamo.nhantumbo@gmail.com` | `mozbid123` | Dra. Mariamo Nhantumbo (100.000 MT em escrow) |
| **Comprador** | `carlos.tembe@gmail.com` | `mozbid123` | Carlos Alberto Tembe |
| **Vendedor Empresa** | `autolux@mozbid.co.mz` | `mozbid123` | AutoLux Moçambique Lda (NUIT Verificado) |
| **Vendedor Particular**| `armando.cossa@gmail.com` | `mozbid123` | Eng. Armando Cossa |
| **Administrador Geral**| `admin@mozbid.co.mz` | `mozbid123` | Administrador de Sistema (Auditoria e KYC) |

---

## 4. Garantias Técnicas

1. **SQLite de Alta Performance**: Motor nativo `node:sqlite` operando em modo WAL (`PRAGMA journal_mode = WAL`), com `busy_timeout = 5000` e integridade referencial ativa.
2. **Atomicidade e Anti-Sniping**: Lances concorrentes processados com `BEGIN IMMEDIATE` com extensão automática de 3 minutos caso surja lance nos 2 minutos finais.
3. **Moeda e Finanças**: Valores monetários rigorosamente manipulados em números inteiros (centavos de Metical) para eliminar erros de arredondamento IEEE 754.
4. **Quasar + Obsidian Reserve**: Componentes Quasar de alto nível combinados com a paleta de luxo Obsidian Reserve (`#080808` a `#202020`, acentos âmbar dourados `#F5A000`, fontes Manrope e Inter).
