# Web3 Hybrid Minting Platform (Web 2.5)

[![Foundry](https://img.shields.io/badge/Foundry-0.2.0-%234c4c44)](https://getfoundry.sh/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2.3-black)](https://nextjs.org/)
[![Wagmi](https://img.shields.io/badge/Wagmi-2.x-%2366b1ff)](https://wagmi.sh/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)](https://www.postgresql.org/)

A standardized, commercial-grade NFT minting platform combining **EVM smart contracts (ERC721A)** with a **Web2 Backend (Prisma + PostgreSQL)** for performance and user experience.

---

## 🏗 Architecture

The project is structured as a monorepo with two main components:

| Component | Tech Stack | Description |
|-----------|------------|-------------|
| **`/contracts`** | Solidity, Foundry, ERC721A | The Smart Contract layer. Handles minting logic, whitelist verification (Merkle Tree), and on-chain ownership. |
| **`/web`** | Next.js, Wagmi, Prisma, TailwindCSS | The Fullstack DApp. Handles UI, wallet connection, Merkle Proof generation (off-chain), and database indexing. |

---

## ⚡ Key Features

- **Gas Optimized**: Uses `ERC721A` to minimize gas costs for batch minting.
- **Whitelist System**: Implements **Merkle Tree** verification for efficient, low-cost off-chain whitelist management.
- **Hybrid Data**: Combines on-chain ownership with off-chain PostgreSQL indexing for instant gallery loading.
- **Modern UI**: Built with Next.js 14, TailwindCSS, and Glassmorphism design.
- **Wallet Auth**: Integrated with ConnectKit & Wagmi for seamless wallet connection.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **Yarn** or NPM
- **Foundry** (Forge) installed
- **Supabase** (or any PostgreSQL) database URL

### 1. Smart Contracts Setup

```bash
cd contracts

# Install dependencies (using npm/yarn because of network restrictions)
npm install

# Compile contracts
forge build

# Run tests (Includes Merkle Tree verification tests)
forge test
```

#### Deployment (Sepolia Testnet)

1. Create a `.env` file in `contracts/`:
   ```env
   PRIVATE_KEY=your_wallet_private_key
   ETHERSCAN_API_KEY=your_etherscan_key (Optional for verification)
   ```

2. Run the deployment script:
   ```bash
   # Load env vars
   source .env
   
   # Deploy and Verify
   forge script script/Deploy.s.sol:DeployScript --rpc-url https://eth-sepolia.g.alchemy.com/v2/demo --broadcast --verify
   ```

3. Note down the **Deployed Contract Address**.

---

### 2. Frontend & Backend Setup

```bash
cd web

# Install dependencies
yarn install
```

#### Configuration

1. Create a `.env` file in `web/` or update `prisma.config.ts`:
   ```env
   DATABASE_URL="postgres://user:pass@db.supabase.co:5432/postgres"
   ```

2. Update Contract Address:
   - Edit `web/constants/index.ts` and paste your deployed contract address.

3. Generate Merkle Tree:
   - Edit `web/scripts/generate-merkle.ts` to include your test wallet addresses.
   - Run the script to generate `whitelist.json`:
     ```bash
     npx ts-node scripts/generate-merkle.ts
     ```

#### Run the App

```bash
# Initialize Database
npx prisma db push

# Start Dev Server
yarn dev
```

Visit `http://localhost:3000` to see your DApp!

---

## 📂 Project Structure

```
├── contracts/
│   ├── src/
│   │   └── MyHybridNFT.sol       # Main ERC721A Contract
│   ├── script/
│   │   └── Deploy.s.sol          # Deployment Script
│   ├── test/
│   │   └── MyHybridNFT.t.sol     # Foundry Unit Tests
│   └── remappings.txt            # Library Mappings
│
└── web/
    ├── app/
    │   └── page.tsx              # Main UI Page
    ├── components/
    │   ├── MintSection.tsx       # Minting Logic Component
    │   ├── Gallery.tsx           # NFT Gallery Component
    │   └── Web3Provider.tsx      # Wagmi/Context Providers
    ├── scripts/
    │   └── generate-merkle.ts    # Off-chain Merkle Script
    └── prisma/
        └── schema.prisma         # Database Schema
```

## 🛠 Useful Commands

- **Generate Proofs**: `cd web && npx ts-node scripts/generate-merkle.ts`
- **Verify Contract**: `forge verify-contract <ADDRESS> src/MyHybridNFT.sol:MyHybridNFT --chain sepolia`
- **Database Studio**: `cd web && npx prisma studio` (Visual Database Editor)

## 📄 License

MIT