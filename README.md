# 🔥 Credible — Web3 Broker Verification

Backend Link: https://github.com/ire-zepelli/credible-backend
<br/>
Blockchain Contract Link: https://sepolia.etherscan.io/address/0x18bd11044da9183c07d8ff7579a5161d9e6f87b9#events

Credible is a Web3 proof-of-concept platform for verifying brokers using both off-chain storage and on-chain trust logic. Brokers submit transactions and credentials off-chain, while hashes are anchored on-chain to build reputation and scoring.

---

## ⚡ Concept

- Store heavy data off-chain (PostgreSQL)
- Store proofs on-chain (Solidity)
- Increase broker credibility through verified actions

---

## 🛠 Tech Stack

- Frontend: React + Tailwind
- Backend: Node.js + Express
- Database: PostgreSQL
- Blockchain: Solidity
- Network: Sepolia Testnet

---

## 🚀 Features

- MetaMask wallet login
- Broker registration with profile hash
- Add transactions (off-chain + on-chain hash)
- Add credentials (off-chain + on-chain hash)
- Confirm transactions and credentials
- Broker reputation scoring
- Admin verification and dispute handling

---

## 📦 Setup

### Install

`````bash
npm install
cd server
npm install````

### Environment

-Create .env in backend:

````bash
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=credible
DB_PASSWORD=password
DB_PORT=5432````

### Run

```bash
# Backend
npm run dev

# Frontend
npm run dev
`````

### MetaMask

- Switch to Sepolia
- Fund with tesh ETH

---

### Flow

1. Connect Wallet
2. Register Broker
3. Submit Transaction
4. Submit Credentials
5. Anchor hash on-chain
6. Admin Confirms
7. Score Updates

---

### Developer Notes

-Built for Hackathon Purposes
