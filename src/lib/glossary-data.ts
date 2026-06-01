export type GlossaryEntry = {
  term: string;
  short: string;
  category: 'core' | 'ethereum' | 'testnet' | 'tooling' | 'security';
  body: string;
};

export const GLOSSARY: GlossaryEntry[] = [
  {
    term: 'Account',
    short: 'An address on a blockchain that holds a balance and can send transactions.',
    category: 'core',
    body: 'An externally owned account (EOA) is controlled by a private key. Contract accounts are controlled by code. Both share the same address format on Ethereum.',
  },
  {
    term: 'Address',
    short: 'A 20-byte identifier (0x…) that receives funds and messages.',
    category: 'core',
    body: 'Derived from the last 20 bytes of the keccak256 hash of a public key. Displayed as 40 hex characters prefixed with 0x. Checksummed (EIP-55) addresses mix upper and lower case to detect typos.',
  },
  {
    term: 'Block',
    short: 'A batch of transactions sealed with a proof and a chain link to the prior block.',
    category: 'core',
    body: 'Each block has a number, a parent hash, a timestamp, a state root, and a list of transactions. Blocks are produced roughly every 12 seconds on Ethereum mainnet.',
  },
  {
    term: 'Block Explorer',
    short: 'A web UI that reads blockchain state and presents it as searchable pages.',
    category: 'tooling',
    body: 'Etherscan, Blockscout, and Sepolia Etherscan let you look up addresses, transactions, tokens, and contract code without running your own node.',
  },
  {
    term: 'Bytecode',
    short: 'The compiled EVM instructions that a contract account stores.',
    category: 'ethereum',
    body: 'Created from Solidity (or another EVM language) source by the compiler. Deployed to chain by sending a transaction whose data is the bytecode. Executed by the EVM.',
  },
  {
    term: 'Chain ID',
    short: 'A numeric identifier that distinguishes networks for signing.',
    category: 'ethereum',
    body: 'Mainnet is 1, Sepolia is 11155111. The chain ID is mixed into every transaction signature (EIP-155) to prevent replay across networks.',
  },
  {
    term: 'Contract',
    short: 'Code deployed to the chain that runs when called.',
    category: 'ethereum',
    body: 'Contracts have an address, code, and storage. They cannot initiate a transaction — only respond to calls. A function marked external is callable from a transaction or another contract.',
  },
  {
    term: 'dApp',
    short: 'Decentralized application — a frontend that talks to on-chain contracts.',
    category: 'core',
    body: 'A dApp typically uses a wallet for signing, an RPC provider for reads, and an indexer for queryable history. The frontend is just a UI; the rules live on chain.',
  },
  {
    term: 'DappLink / Link Token',
    short: 'Testnet bridge that maps ERC-20 tokens across test networks.',
    category: 'testnet',
    body: 'A faucet-adjacent tool that gives you a tiny amount of a token on a new testnet when you prove ownership of a matching balance on another.',
  },
  {
    term: 'EIP',
    short: 'Ethereum Improvement Proposal — the design-doc format for protocol changes.',
    category: 'ethereum',
    body: 'Finalized EIPs (ERC-20, ERC-721, EIP-1559) become standards. Drafts can sit in review for years. The repo is public on GitHub.',
  },
  {
    term: 'EOA',
    short: 'Externally Owned Account — an address controlled by a private key, not by code.',
    category: 'ethereum',
    body: 'Only EOAs can start a transaction. A contract cannot move funds unless an EOA calls one of its functions first.',
  },
  {
    term: 'ERC-20',
    short: 'The standard interface for fungible tokens.',
    category: 'ethereum',
    body: 'Defines balanceOf, transfer, transferFrom, approve, allowance. Most tokens you interact with (USDC, DAI, LINK) follow this standard.',
  },
  {
    term: 'ERC-721',
    short: 'The standard interface for non-fungible tokens (NFTs).',
    category: 'ethereum',
    body: 'Each tokenId is unique. ownerOf returns the holder. safeTransferFrom checks that the receiver can accept the token (a contract must implement IERC721Receiver).',
  },
  {
    term: 'ERC-1155',
    short: 'A multi-token standard — one contract can hold fungible and non-fungible balances.',
    category: 'ethereum',
    body: 'Used by games and large collections because it batches transfers in a single call and saves gas versus deploying one ERC-20 + many ERC-721s.',
  },
  {
    term: 'ETH',
    short: 'The native asset of Ethereum. Used to pay gas.',
    category: 'core',
    body: 'Denominations: 1 ether = 1e18 wei = 1e9 gwei. Gas prices are quoted in gwei. Account balances are stored in wei.',
  },
  {
    term: 'EVM',
    short: 'Ethereum Virtual Machine — the runtime that executes bytecode.',
    category: 'ethereum',
    body: 'Stack-based, 256-bit word size. Every node on the network runs the same EVM and reaches the same state root. Execution is deterministic — given a tx and a pre-state, the post-state is reproducible.',
  },
  {
    term: 'Faucet',
    short: 'A service that gives small amounts of testnet ETH for free.',
    category: 'testnet',
    body: 'Faucets rate-limit by IP, address, or social-account to prevent abuse. They exist because testnet ETH has no value but real network cost to produce.',
  },
  {
    term: 'Fee',
    short: 'The cost paid to the network to include a transaction.',
    category: 'ethereum',
    body: 'After EIP-1559 the fee is baseFee + priority. baseFee is burned; priority goes to the proposer. The total gasUsed * (baseFee + priority). Wallets usually abstract this.',
  },
  {
    term: 'Gas',
    short: 'The unit of work the EVM charges for each opcode.',
    category: 'ethereum',
    body: 'A simple transfer costs 21000 gas. Contract calls cost more depending on storage and computation. Out-of-gas reverts the tx but consumes the fee.',
  },
  {
    term: 'Gas Limit',
    short: 'The maximum gas a transaction is allowed to consume.',
    category: 'ethereum',
    body: 'Set by the sender. If the tx runs out, it reverts and the fee is still paid up to the limit. Wallets estimate a safe upper bound so your tx does not get stuck mid-execution.',
  },
  {
    term: 'Gas Price',
    short: 'How much wei you pay per unit of gas.',
    category: 'ethereum',
    body: 'Pre-1559 you set it directly. Post-1559 you set a maxFeePerGas and maxPriorityFeePerGas; the protocol picks an effective gas price inside that cap.',
  },
  {
    term: 'Gwei',
    short: '10^9 wei — the unit gas prices are quoted in.',
    category: 'ethereum',
    body: '1 gwei = 0.000000001 ETH. A typical mainnet transfer might cost 30-80 gwei in priority, plus the baseFee. On Sepolia the floor is around 1-5 gwei.',
  },
  {
    term: 'Hash',
    short: 'A fixed-length fingerprint of data, produced by a one-way function.',
    category: 'core',
    body: 'Ethereum uses keccak256. A block hash, tx hash, and the hash of an address are all keccak256 of different inputs. SHA-3 is the standardized version; they differ by a single byte.',
  },
  {
    term: 'HD Wallet',
    short: 'A wallet that derives many keys from a single seed phrase.',
    category: 'tooling',
    body: 'BIP-39 defines the seed phrase (12 or 24 words). BIP-32 defines the tree. BIP-44 defines the path scheme (m/44\'/60\'/0\'/0/0 for the first Ethereum account).',
  },
  {
    term: 'Hot Wallet',
    short: 'A wallet whose keys live on an internet-connected device.',
    category: 'security',
    body: 'Convenient for daily use, but exposed to malware and phishing. For long-term storage prefer a cold wallet (hardware device, paper, or air-gapped signer).',
  },
  {
    term: 'Index',
    short: 'A database that maps on-chain events to queryable rows.',
    category: 'tooling',
    body: 'A node is great for state, weak for history. The Graph, Ponder, and Envio build SQL/GraphQL indices from logs so dApps can paginate transfers cheaply.',
  },
  {
    term: 'Keystore',
    short: 'An encrypted JSON file that holds a private key, protected by a password.',
    category: 'security',
    body: 'Generated by older wallets (MyEtherWallet, Geth). The password decrypts the key. The file is safe to back up, the password is not.',
  },
  {
    term: 'Layer 2',
    short: 'A network that batches transactions and posts results to a parent chain.',
    category: 'ethereum',
    body: 'Optimistic rollups (Arbitrum, Optimism) assume validity and let users challenge fraud. ZK rollups (zkSync, Starknet) prove validity with a zero-knowledge proof.',
  },
  {
    term: 'Log',
    short: 'A record emitted by a contract event, stored in transaction receipts.',
    category: 'ethereum',
    body: 'Logs are how dApps learn about state changes without re-running the world. Each event has up to 4 topics (the first is the event signature hash) and arbitrary data.',
  },
  {
    term: 'Mainnet',
    short: 'The production Ethereum network, chain ID 1.',
    category: 'core',
    body: 'Real ETH, real risk, real fees. Anything deployed here cannot be undone — test on a testnet first.',
  },
  {
    term: 'Mempool',
    short: 'The set of unconfirmed transactions a node has seen and is willing to relay.',
    category: 'ethereum',
    body: 'There is no single canonical mempool; each node has its own view. Searchers watch it for arbitrage and liquidations, then bundle transactions for MEV extraction.',
  },
  {
    term: 'Merkle Patricia Trie',
    short: 'The trie structure Ethereum uses to commit to state, transactions, and receipts.',
    category: 'ethereum',
    body: 'A block header contains three roots: stateRoot, transactionsRoot, receiptsRoot. Each is the keccak256 of the root of a Merkle Patricia Trie.',
  },
  {
    term: 'MetaMask',
    short: 'The most popular browser-extension wallet.',
    category: 'tooling',
    body: 'A hot wallet that injects an Ethereum provider into web pages. Supports multiple networks, testnets, and hardware-wallet bridging.',
  },
  {
    term: 'Metamask Snaps',
    short: 'Sandboxed extensions that let MetaMask support non-EVM chains and new features.',
    category: 'tooling',
    body: 'Used to add Bitcoin, Solana, Sui, and other networks without forking the wallet core.',
  },
  {
    term: 'MEV',
    short: 'Maximal Extractable Value — profit a block producer can capture by reordering, inserting, or censoring transactions.',
    category: 'ethereum',
    body: 'Includes sandwich attacks, liquidations, and arbitrage. MEV-Boost separates block building from proposing to democratize access.',
  },
  {
    term: 'NFT',
    short: 'Non-Fungible Token — a unique on-chain asset, typically ERC-721 or ERC-1155.',
    category: 'core',
    body: 'The on-chain token points to metadata (usually IPFS or HTTPS). The metadata describes the asset (image, traits, etc.).',
  },
  {
    term: 'Nonce',
    short: 'A counter that prevents replay and orders transactions per account.',
    category: 'ethereum',
    body: 'Each transaction from an EOA must use a nonce exactly one higher than the last confirmed one. Skipping a nonce leaves a tx stuck.',
  },
  {
    term: 'Oracle',
    short: 'A service that brings off-chain data on-chain for contracts to read.',
    category: 'ethereum',
    body: 'Chainlink is the dominant oracle network. Push oracles update state on a heartbeat; pull oracles let contracts request fresh data and pay on read.',
  },
  {
    term: 'Private Key',
    short: 'The 32-byte secret that controls an EOA. Anyone with it owns the account.',
    category: 'security',
    body: 'Never share it. Never type it into a browser. Store offline. If someone asks for your "private key" or "seed phrase" to "verify" anything, they are stealing from you.',
  },
  {
    term: 'Public Key',
    short: 'The cryptographic counterpart to a private key, used to derive an address.',
    category: 'core',
    body: 'Safe to share. Verifies signatures produced by the matching private key. Address = last 20 bytes of keccak256(publicKey).',
  },
  {
    term: 'Receipt',
    short: 'The result of a transaction — gas used, logs emitted, status code, contract address if it was a deployment.',
    category: 'ethereum',
    body: 'Fetched with eth_getTransactionReceipt. status 0x1 = success, 0x0 = revert. Logs are here, not in the transaction itself.',
  },
  {
    term: 'RPC',
    short: 'Remote Procedure Call — the JSON-RPC interface Ethereum nodes expose.',
    category: 'ethereum',
    body: 'Reads are free and stateless (eth_call, eth_getBalance). Writes are signed and broadcast (eth_sendRawTransaction). Public RPCs exist; production projects run or pay for a dedicated endpoint.',
  },
  {
    term: 'Sepolia',
    short: 'The recommended Ethereum testnet for application development.',
    category: 'testnet',
    body: 'Chain ID 11155111. Replaced Goerli in 2023. Faucet ETH has no monetary value but real economic cost to produce, so faucets are rate-limited.',
  },
  {
    term: 'Signature',
    short: 'A cryptographic proof that the holder of a private key approved a transaction.',
    category: 'core',
    body: 'Ethereum uses ECDSA over secp256k1. EIP-712 extends this to structured data, letting wallets show human-readable signing prompts.',
  },
  {
    term: 'Smart Contract',
    short: 'A program stored on the blockchain that runs when called.',
    category: 'ethereum',
    body: 'Synonymous with "contract" in this context. Composed of bytecode plus storage. Invariant: code is law, but only if your code is what you think it is — always verify on a block explorer.',
  },
  {
    term: 'Solidity',
    short: 'The dominant language for writing EVM contracts.',
    category: 'ethereum',
    body: 'Statically typed, curly-brace syntax, compiles to EVM bytecode. The .sol file → solc → .bin + .abi. Versions are pinned per file with `pragma`.',
  },
  {
    term: 'Testnet',
    short: 'A clone of mainnet where ETH is free and mistakes are cheap.',
    category: 'testnet',
    body: 'Use Sepolia for app development, Holesky for staking/infrastructure testing. Testnet state is regularly pruned — do not rely on it persisting.',
  },
  {
    term: 'Token',
    short: 'A smart contract that tracks who owns what, separate from native ETH.',
    category: 'core',
    body: 'Fungible tokens use ERC-20. NFTs use ERC-721 or ERC-1155. The contract is the source of truth — the UI is just a renderer.',
  },
  {
    term: 'Transaction',
    short: 'A signed message that changes chain state.',
    category: 'ethereum',
    body: 'Contains nonce, gas params, to, value, data, and a signature. A transfer is a tx with empty data and value > 0. A contract call is a tx with non-empty data.',
  },
  {
    term: 'Vyper',
    short: 'A Pythonic, security-focused alternative to Solidity.',
    category: 'ethereum',
    body: 'Curly-brace-free, deliberately restrictive. Used by Curve and a few other protocols. Smaller developer pool than Solidity.',
  },
  {
    term: 'Wallet',
    short: 'Software or hardware that holds keys and signs transactions.',
    category: 'core',
    body: 'Wallets never store ETH — they store keys. The chain holds the balance. The wallet talks to the chain via an RPC provider.',
  },
  {
    term: 'Wei',
    short: 'The smallest unit of ETH. 1 ETH = 10^18 wei.',
    category: 'ethereum',
    body: 'All on-chain math is in wei. The display layer (gwei, ETH) is for humans.',
  },
  {
    term: 'Wrapped ETH (WETH)',
    short: 'ERC-20 ETH — useful because native ETH does not implement ERC-20.',
    category: 'ethereum',
    body: 'Deposit ETH, get WETH. Withdraw WETH, get ETH. Lets you swap, lend, and provide liquidity with ETH the same way you would with any other ERC-20.',
  },
];

export type Faucet = {
  name: string;
  network: 'sepolia' | 'holesky' | 'other';
  url: string;
  notes: string;
  cooldownHours: number;
};

export const FAUCETS: Faucet[] = [
  {
    name: 'Google Cloud Faucet',
    network: 'sepolia',
    url: 'https://cloud.google.com/application/web3/faucet',
    notes: 'Sign in with Google. 0.05 SepoliaETH per 24h per account. Most reliable in 2024-2026.',
    cooldownHours: 24,
  },
  {
    name: 'Alchemy Sepolia Faucet',
    network: 'sepolia',
    url: 'https://www.alchemy.com/faucets/ethereum-sepolia',
    notes: 'Free Alchemy account. 0.5 SepoliaETH per claim. Sometimes pauses for new chains.',
    cooldownHours: 24,
  },
  {
    name: 'Infura Sepolia Faucet',
    network: 'sepolia',
    url: 'https://www.infura.io/faucet',
    notes: 'Requires Infura account. 0.5 SepoliaETH per 24h. Linked to your project key.',
    cooldownHours: 24,
  },
  {
    name: 'Chainlink Faucet',
    network: 'sepolia',
    url: 'https://faucets.chain.link/sepolia',
    notes: '0.1 SepoliaETH per claim. Sometimes requires a small mainnet balance or social check.',
    cooldownHours: 24,
  },
  {
    name: 'Sepolia PoW Faucet',
    network: 'sepolia',
    url: 'https://sepolia-faucet.pk910.de/',
    notes: 'Mine a tiny PoW puzzle in the browser. No account needed. Earned ETH depends on your hashrate.',
    cooldownHours: 0,
  },
  {
    name: 'Holesky Faucet (Holsky)',
    network: 'holesky',
    url: 'https://cloud.google.com/application/web3/faucet',
    notes: 'Same Google faucet, switch to Holesky. Use for staking, validator, and infrastructure testing.',
    cooldownHours: 24,
  },
];

export type RpcEndpoint = {
  name: string;
  url: string;
  network: 'sepolia' | 'holesky' | 'mainnet';
  auth: 'none' | 'key';
  notes: string;
};

export const RPC_ENDPOINTS: RpcEndpoint[] = [
  {
    name: 'PublicNode (Sepolia)',
    url: 'https://ethereum-sepolia-rpc.publicnode.com',
    network: 'sepolia',
    auth: 'none',
    notes: 'No key, no rate limit header. Good default for this app.',
  },
  {
    name: 'Cloudflare ETH (Sepolia)',
    url: 'https://cloudflare-eth.com',
    network: 'sepolia',
    auth: 'none',
    notes: 'Routes to mainnet by default; supports testnet via subdomain.',
  },
  {
    name: 'Ankr (Sepolia)',
    url: 'https://rpc.ankr.com/eth_sepolia',
    network: 'sepolia',
    auth: 'none',
    notes: 'Free tier. 30 req/s on public endpoints.',
  },
  {
    name: 'Alchemy (Sepolia)',
    url: 'https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY',
    network: 'sepolia',
    auth: 'key',
    notes: 'Replace YOUR_KEY with a project key from alchemy.com.',
  },
  {
    name: 'Infura (Sepolia)',
    url: 'https://sepolia.infura.io/v3/YOUR_KEY',
    network: 'sepolia',
    auth: 'key',
    notes: 'Replace YOUR_KEY with a project ID from infura.io.',
  },
  {
    name: 'PublicNode (Holesky)',
    url: 'https://ethereum-holesky-rpc.publicnode.com',
    network: 'holesky',
    auth: 'none',
    notes: 'No key. Used by validators and infrastructure tooling.',
  },
];

export const CHEATSHEET_METHODS: { method: string; summary: string; example: string }[] = [
  {
    method: 'eth_blockNumber',
    summary: 'Returns the latest block number.',
    example: 'curl -X POST -H "Content-Type: application/json" --data \'{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}\' https://ethereum-sepolia-rpc.publicnode.com',
  },
  {
    method: 'eth_getBalance',
    summary: 'Returns the wei balance of an address.',
    example: '{"jsonrpc":"2.0","method":"eth_getBalance","params":["0xYOUR…","latest"],"id":1}',
  },
  {
    method: 'eth_getTransactionCount',
    summary: 'Returns the nonce of an address (sent tx count).',
    example: '{"jsonrpc":"2.0","method":"eth_getTransactionCount","params":["0xYOUR…","latest"],"id":1}',
  },
  {
    method: 'eth_getTransactionByHash',
    summary: 'Returns a transaction object by hash.',
    example: '{"jsonrpc":"2.0","method":"eth_getTransactionByHash","params":["0xHASH…"],"id":1}',
  },
  {
    method: 'eth_getTransactionReceipt',
    summary: 'Returns the receipt (status, gasUsed, logs) for a confirmed tx.',
    example: '{"jsonrpc":"2.0","method":"eth_getTransactionReceipt","params":["0xHASH…"],"id":1}',
  },
  {
    method: 'eth_call',
    summary: 'Executes a read-only call against a contract at a given block.',
    example: '{"jsonrpc":"2.0","method":"eth_call","params":[{"to":"0xCONTRACT…","data":"0x70a08231…"},"latest"],"id":1}',
  },
  {
    method: 'eth_estimateGas',
    summary: 'Estimates the gas a transaction would use.',
    example: '{"jsonrpc":"2.0","method":"eth_estimateGas","params":[{"to":"0x…","data":"0x…"}],"id":1}',
  },
  {
    method: 'eth_gasPrice',
    summary: 'Returns the current gas price in wei (legacy field; use fee history for EIP-1559).',
    example: '{"jsonrpc":"2.0","method":"eth_gasPrice","params":[],"id":1}',
  },
  {
    method: 'eth_feeHistory',
    summary: 'Returns the baseFee and priority for the last N blocks.',
    example: '{"jsonrpc":"2.0","method":"eth_feeHistory","params":["0x5","latest",[10,50,90]],"id":1}',
  },
  {
    method: 'eth_sendRawTransaction',
    summary: 'Broadcasts a signed transaction. Returns the tx hash.',
    example: '{"jsonrpc":"2.0","method":"eth_sendRawTransaction","params":["0xSIGNED…"],"id":1}',
  },
  {
    method: 'eth_getLogs',
    summary: 'Returns logs matching address/topic filters in a block range.',
    example: '{"jsonrpc":"2.0","method":"eth_getLogs","params":[{"fromBlock":"0x0","toBlock":"latest","address":"0x…","topics":["0x…"]}],"id":1}',
  },
  {
    method: 'eth_chainId',
    summary: 'Returns the chain ID of the connected network.',
    example: '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}',
  },
];
