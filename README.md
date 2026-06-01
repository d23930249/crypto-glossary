# Crypto and Testnet Glossary

A bakti-styled Next.js dApp for the Ethereum Sepolia testnet.

## What it does
- Searchable glossary plus faucet and RPC cheatsheet
- flashcard quiz
- offline

## Testnet
- Network: Ethereum Sepolia testnet
- RPC endpoint: https://ethereum-sepolia-rpc.publicnode.com (JSON-RPC)

## Wallet
- MetaMask / any injected EIP-1193 wallet, via wagmi + viem (Sepolia). Connect from the header to read your own account and sign/send transactions.

## Usage
```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # production build
```
Enter a testnet address / hash / value in the tool and read live on-chain data. Connect a wallet for actions that sign or send.

## Faucet
- Testnet ETH: https://sepoliafaucet.com or https://www.alchemy.com/faucets/ethereum-sepolia

## Limitations
- Testnet only. Reads live data over the public RPC above.
- Wallet connect + signing requires a browser wallet extension and a funded testnet account; not exercised in headless CI.
- Stack: Next.js 15, TypeScript, Tailwind v4. Design system shared across all tools.
