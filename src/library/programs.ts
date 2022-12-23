import {
  BPF_LOADER_DEPRECATED_PROGRAM_ID,
  BPF_LOADER_PROGRAM_ID,
  Ed25519Program,
  Secp256k1Program,
  StakeProgram,
  SystemProgram,
  VOTE_PROGRAM_ID,
} from "@solana/web3.js";
import { INetwork } from "types/internal";
import { ALL_NETWORKS, LIVE_NETWORKS } from "utils/internal";

// Copied and modified from https://github.com/solana-labs/solana/blob/adcc36da8e1961e2730c926b77faede12c9c5407/explorer/src/utils/tx.ts

export const programLabel = (
  address: string,
  network: INetwork
): string | undefined => {
  const programInfo = PROGRAM_INFO_BY_ID[address];
  if (programInfo && programInfo.deployments.includes(network)) {
    return programInfo.name;
  }

  return LOADER_IDS[address];
};

export enum PROGRAM_NAMES {
  // native built-ins
  ADDRESS_LOOKUP_TABLE = "Address Lookup Table Program",
  COMPUTE_BUDGET = "Compute Budget Program",
  CONFIG = "Config Program",
  STAKE = "Stake Program",
  SYSTEM = "System Program",
  VOTE = "Vote Program",

  // native precompiles
  SECP256K1 = "Secp256k1 SigVerify Precompile",
  ED25519 = "Ed25519 SigVerify Precompile",

  // spl
  ASSOCIATED_TOKEN = "Associated Token Program",
  FEATURE_PROPOSAL = "Feature Proposal Program",
  LENDING = "Lending Program",
  MEMO = "Memo Program",
  MEMO_2 = "Memo Program v2",
  NAME = "Name Service Program",
  STAKE_POOL = "Stake Pool Program",
  SWAP = "Swap Program",
  TOKEN = "Token Program",
  TOKEN_METADATA = "Token Metadata Program",
  TOKEN_VAULT = "Token Vault Program",

  // other
  ACUMEN = "Acumen Program",
  BONFIDA_POOL = "Bonfida Pool Program",
  BREAK_SOLANA = "Break Solana Program",
  CHAINLINK_ORACLE = "Chainlink OCR2 Oracle Program",
  CHAINLINK_STORE = "Chainlink Store Program",
  MANGO_GOVERNANCE = "Mango Governance Program",
  MANGO_ICO = "Mango ICO Program",
  MANGO_1 = "Mango Program v1",
  MANGO_2 = "Mango Program v2",
  MANGO_3 = "Mango Program v3",
  MARINADE = "Marinade Staking Program",
  MERCURIAL = "Mercurial Stable Swap Program",
  METAPLEX = "Metaplex Program",
  NFT_AUCTION = "NFT Auction Program",
  NFT_CANDY_MACHINE = "NFT Candy Machine Program",
  NFT_CANDY_MACHINE_V2 = "NFT Candy Machine Program V2",
  ORCA_SWAP_1 = "Orca Swap Program v1",
  ORCA_SWAP_2 = "Orca Swap Program v2",
  ORCA_AQUAFARM = "Orca Aquafarm Program",
  PORT = "Port Finance Program",
  PYTH_DEVNET = "Pyth Oracle Program",
  PYTH_TESTNET = "Pyth Oracle Program",
  PYTH_MAINNET = "Pyth Oracle Program",
  QUARRY_MERGE_MINE = "Quarry Merge Mine",
  QUARRY_MINE = "Quarry Mine",
  QUARRY_MINT_WRAPPER = "Quarry Mint Wrapper",
  QUARRY_REDEEMER = "Quarry Redeemer",
  QUARRY_REGISTRY = "Quarry Registry",
  RAYDIUM_AMM = "Raydium AMM Program",
  RAYDIUM_IDO = "Raydium IDO Program",
  RAYDIUM_LP_1 = "Raydium Liquidity Pool Program v1",
  RAYDIUM_LP_2 = "Raydium Liquidity Pool Program v2",
  RAYDIUM_STAKING = "Raydium Staking Program",
  SABER_ROUTER = "Saber Router Program",
  SABER_SWAP = "Saber Stable Swap Program",
  SERUM_1 = "Serum Dex Program v1",
  SERUM_2 = "Serum Dex Program v2",
  SERUM_3 = "Serum Dex Program v3",
  SERUM_SWAP = "Serum Swap Program",
  SOLEND = "Solend Program",
  SOLIDO = "Lido for Solana Program",
  STEP_SWAP = "Step Finance Swap Program",
  SWIM_SWAP = "Swim Swap Program",
  SWITCHBOARD = "Switchboard Oracle Program",
  WORMHOLE = "Wormhole",
  SOLANART = "Solanart",
  SOLANART_GO = "Solanart - Global offers",
  STEPN_DEX = "STEPN Dex",
}

export type ProgramInfo = {
  name: string;
  deployments: INetwork[];
};

export const PROGRAM_INFO_BY_ID: { [address: string]: ProgramInfo } = {
  // native built-ins
  AddressLookupTab1e1111111111111111111111111: {
    name: PROGRAM_NAMES.ADDRESS_LOOKUP_TABLE,
    deployments: ALL_NETWORKS,
  },
  ComputeBudget111111111111111111111111111111: {
    name: PROGRAM_NAMES.COMPUTE_BUDGET,
    deployments: ALL_NETWORKS,
  },
  Config1111111111111111111111111111111111111: {
    name: PROGRAM_NAMES.CONFIG,
    deployments: ALL_NETWORKS,
  },
  [StakeProgram.programId.toBase58()]: {
    name: PROGRAM_NAMES.STAKE,
    deployments: ALL_NETWORKS,
  },
  [SystemProgram.programId.toBase58()]: {
    name: PROGRAM_NAMES.SYSTEM,
    deployments: ALL_NETWORKS,
  },
  [VOTE_PROGRAM_ID.toBase58()]: {
    name: PROGRAM_NAMES.VOTE,
    deployments: ALL_NETWORKS,
  },

  // native precompiles
  [Secp256k1Program.programId.toBase58()]: {
    name: PROGRAM_NAMES.SECP256K1,
    deployments: ALL_NETWORKS,
  },
  [Ed25519Program.programId.toBase58()]: {
    name: PROGRAM_NAMES.ED25519,
    deployments: ALL_NETWORKS,
  },

  // spl
  ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL: {
    name: PROGRAM_NAMES.ASSOCIATED_TOKEN,
    deployments: ALL_NETWORKS,
  },
  Feat1YXHhH6t1juaWF74WLcfv4XoNocjXA6sPWHNgAse: {
    name: PROGRAM_NAMES.FEATURE_PROPOSAL,
    deployments: ALL_NETWORKS,
  },
  LendZqTs7gn5CTSJU1jWKhKuVpjJGom45nnwPb2AMTi: {
    name: PROGRAM_NAMES.LENDING,
    deployments: LIVE_NETWORKS,
  },
  Memo1UhkJRfHyvLMcVucJwxXeuD728EqVDDwQDxFMNo: {
    name: PROGRAM_NAMES.MEMO,
    deployments: ALL_NETWORKS,
  },
  MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr: {
    name: PROGRAM_NAMES.MEMO_2,
    deployments: ALL_NETWORKS,
  },
  namesLPneVptA9Z5rqUDD9tMTWEJwofgaYwp8cawRkX: {
    name: PROGRAM_NAMES.NAME,
    deployments: LIVE_NETWORKS,
  },
  SPoo1Ku8WFXoNDMHPsrGSTSG1Y47rzgn41SLUNakuHy: {
    name: PROGRAM_NAMES.STAKE_POOL,
    deployments: LIVE_NETWORKS,
  },
  SwaPpA9LAaLfeLi3a68M4DjnLqgtticKg6CnyNwgAC8: {
    name: PROGRAM_NAMES.SWAP,
    deployments: LIVE_NETWORKS,
  },
  TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA: {
    name: PROGRAM_NAMES.TOKEN,
    deployments: ALL_NETWORKS,
  },
  metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s: {
    name: PROGRAM_NAMES.TOKEN_METADATA,
    deployments: LIVE_NETWORKS,
  },
  vau1zxA2LbssAUEF7Gpw91zMM1LvXrvpzJtmZ58rPsn: {
    name: PROGRAM_NAMES.TOKEN_VAULT,
    deployments: LIVE_NETWORKS,
  },

  // other
  C64kTdg1Hzv5KoQmZrQRcm2Qz7PkxtFBgw7EpFhvYn8W: {
    name: PROGRAM_NAMES.ACUMEN,
    deployments: ["mainnet-beta"],
  },
  WvmTNLpGMVbwJVYztYL4Hnsy82cJhQorxjnnXcRm3b6: {
    name: PROGRAM_NAMES.BONFIDA_POOL,
    deployments: ["mainnet-beta"],
  },
  BrEAK7zGZ6dM71zUDACDqJnekihmwF15noTddWTsknjC: {
    name: PROGRAM_NAMES.BREAK_SOLANA,
    deployments: LIVE_NETWORKS,
  },
  cjg3oHmg9uuPsP8D6g29NWvhySJkdYdAo9D25PRbKXJ: {
    name: PROGRAM_NAMES.CHAINLINK_ORACLE,
    deployments: ["devnet", "mainnet-beta"],
  },
  HEvSKofvBgfaexv23kMabbYqxasxU3mQ4ibBMEmJWHny: {
    name: PROGRAM_NAMES.CHAINLINK_STORE,
    deployments: ["devnet", "mainnet-beta"],
  },
  GqTPL6qRf5aUuqscLh8Rg2HTxPUXfhhAXDptTLhp1t2J: {
    name: PROGRAM_NAMES.MANGO_GOVERNANCE,
    deployments: ["mainnet-beta"],
  },
  "7sPptkymzvayoSbLXzBsXEF8TSf3typNnAWkrKrDizNb": {
    name: PROGRAM_NAMES.MANGO_ICO,
    deployments: ["mainnet-beta"],
  },
  JD3bq9hGdy38PuWQ4h2YJpELmHVGPPfFSuFkpzAd9zfu: {
    name: PROGRAM_NAMES.MANGO_1,
    deployments: ["mainnet-beta"],
  },
  "5fNfvyp5czQVX77yoACa3JJVEhdRaWjPuazuWgjhTqEH": {
    name: PROGRAM_NAMES.MANGO_2,
    deployments: ["mainnet-beta"],
  },
  mv3ekLzLbnVPNxjSKvqBpU3ZeZXPQdEC3bp5MDEBG68: {
    name: PROGRAM_NAMES.MANGO_3,
    deployments: ["mainnet-beta"],
  },
  MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD: {
    name: PROGRAM_NAMES.MARINADE,
    deployments: ["mainnet-beta"],
  },
  MERLuDFBMmsHnsBPZw2sDQZHvXFMwp8EdjudcU2HKky: {
    name: PROGRAM_NAMES.MERCURIAL,
    deployments: ["devnet", "mainnet-beta"],
  },
  p1exdMJcjVao65QdewkaZRUnU6VPSXhus9n2GzWfh98: {
    name: PROGRAM_NAMES.METAPLEX,
    deployments: LIVE_NETWORKS,
  },
  auctxRXPeJoc4817jDhf4HbjnhEcr1cCXenosMhK5R8: {
    name: PROGRAM_NAMES.NFT_AUCTION,
    deployments: LIVE_NETWORKS,
  },
  cndyAnrLdpjq1Ssp1z8xxDsB8dxe7u4HL5Nxi2K5WXZ: {
    name: PROGRAM_NAMES.NFT_CANDY_MACHINE,
    deployments: LIVE_NETWORKS,
  },
  cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ: {
    name: PROGRAM_NAMES.NFT_CANDY_MACHINE_V2,
    deployments: LIVE_NETWORKS,
  },
  DjVE6JNiYqPL2QXyCUUh8rNjHrbz9hXHNYt99MQ59qw1: {
    name: PROGRAM_NAMES.ORCA_SWAP_1,
    deployments: ["mainnet-beta"],
  },
  "9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP": {
    name: PROGRAM_NAMES.ORCA_SWAP_2,
    deployments: ["mainnet-beta"],
  },
  "82yxjeMsvaURa4MbZZ7WZZHfobirZYkH1zF8fmeGtyaQ": {
    name: PROGRAM_NAMES.ORCA_AQUAFARM,
    deployments: ["mainnet-beta"],
  },
  Port7uDYB3wk6GJAw4KT1WpTeMtSu9bTcChBHkX2LfR: {
    name: PROGRAM_NAMES.PORT,
    deployments: ["mainnet-beta"],
  },
  gSbePebfvPy7tRqimPoVecS2UsBvYv46ynrzWocc92s: {
    name: PROGRAM_NAMES.PYTH_DEVNET,
    deployments: ["devnet"],
  },
  "8tfDNiaEyrV6Q1U4DEXrEigs9DoDtkugzFbybENEbCDz": {
    name: PROGRAM_NAMES.PYTH_TESTNET,
    deployments: ["testnet"],
  },
  FsJ3A3u2vn5cTVofAjvy6y5kwABJAqYWpe4975bi2epH: {
    name: PROGRAM_NAMES.PYTH_MAINNET,
    deployments: ["mainnet-beta"],
  },
  QMMD16kjauP5knBwxNUJRZ1Z5o3deBuFrqVjBVmmqto: {
    name: PROGRAM_NAMES.QUARRY_MERGE_MINE,
    deployments: LIVE_NETWORKS,
  },
  QMNeHCGYnLVDn1icRAfQZpjPLBNkfGbSKRB83G5d8KB: {
    name: PROGRAM_NAMES.QUARRY_MINE,
    deployments: LIVE_NETWORKS,
  },
  QMWoBmAyJLAsA1Lh9ugMTw2gciTihncciphzdNzdZYV: {
    name: PROGRAM_NAMES.QUARRY_MINT_WRAPPER,
    deployments: LIVE_NETWORKS,
  },
  QRDxhMw1P2NEfiw5mYXG79bwfgHTdasY2xNP76XSea9: {
    name: PROGRAM_NAMES.QUARRY_REDEEMER,
    deployments: LIVE_NETWORKS,
  },
  QREGBnEj9Sa5uR91AV8u3FxThgP5ZCvdZUW2bHAkfNc: {
    name: PROGRAM_NAMES.QUARRY_REGISTRY,
    deployments: LIVE_NETWORKS,
  },
  "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8": {
    name: PROGRAM_NAMES.RAYDIUM_AMM,
    deployments: ["mainnet-beta"],
  },
  "9HzJyW1qZsEiSfMUf6L2jo3CcTKAyBmSyKdwQeYisHrC": {
    name: PROGRAM_NAMES.RAYDIUM_IDO,
    deployments: ["mainnet-beta"],
  },
  RVKd61ztZW9GUwhRbbLoYVRE5Xf1B2tVscKqwZqXgEr: {
    name: PROGRAM_NAMES.RAYDIUM_LP_1,
    deployments: ["mainnet-beta"],
  },
  "27haf8L6oxUeXrHrgEgsexjSY5hbVUWEmvv9Nyxg8vQv": {
    name: PROGRAM_NAMES.RAYDIUM_LP_2,
    deployments: ["mainnet-beta"],
  },
  EhhTKczWMGQt46ynNeRX1WfeagwwJd7ufHvCDjRxjo5Q: {
    name: PROGRAM_NAMES.RAYDIUM_STAKING,
    deployments: ["mainnet-beta"],
  },
  Crt7UoUR6QgrFrN7j8rmSQpUTNWNSitSwWvsWGf1qZ5t: {
    name: PROGRAM_NAMES.SABER_ROUTER,
    deployments: ["devnet", "mainnet-beta"],
  },
  SSwpkEEcbUqx4vtoEByFjSkhKdCT862DNVb52nZg1UZ: {
    name: PROGRAM_NAMES.SABER_SWAP,
    deployments: ["devnet", "mainnet-beta"],
  },
  BJ3jrUzddfuSrZHXSCxMUUQsjKEyLmuuyZebkcaFp2fg: {
    name: PROGRAM_NAMES.SERUM_1,
    deployments: ["mainnet-beta"],
  },
  EUqojwWA2rd19FZrzeBncJsm38Jm1hEhE3zsmX3bRc2o: {
    name: PROGRAM_NAMES.SERUM_2,
    deployments: ["mainnet-beta"],
  },
  "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin": {
    name: PROGRAM_NAMES.SERUM_3,
    deployments: ["mainnet-beta"],
  },
  "22Y43yTVxuUkoRKdm9thyRhQ3SdgQS7c7kB6UNCiaczD": {
    name: PROGRAM_NAMES.SERUM_SWAP,
    deployments: ["mainnet-beta"],
  },
  So1endDq2YkqhipRh3WViPa8hdiSpxWy6z3Z6tMCpAo: {
    name: PROGRAM_NAMES.SOLEND,
    deployments: ["mainnet-beta"],
  },
  CrX7kMhLC3cSsXJdT7JDgqrRVWGnUpX3gfEfxxU2NVLi: {
    name: PROGRAM_NAMES.SOLIDO,
    deployments: ["mainnet-beta"],
  },
  SSwpMgqNDsyV7mAgN9ady4bDVu5ySjmmXejXvy2vLt1: {
    name: PROGRAM_NAMES.STEP_SWAP,
    deployments: ["mainnet-beta"],
  },
  SWiMDJYFUGj6cPrQ6QYYYWZtvXQdRChSVAygDZDsCHC: {
    name: PROGRAM_NAMES.SWIM_SWAP,
    deployments: ["mainnet-beta"],
  },
  DtmE9D2CSB4L5D6A15mraeEjrGMm6auWVzgaD8hK2tZM: {
    name: PROGRAM_NAMES.SWITCHBOARD,
    deployments: ["mainnet-beta"],
  },
  WormT3McKhFJ2RkiGpdw9GKvNCrB2aB54gb2uV9MfQC: {
    name: PROGRAM_NAMES.WORMHOLE,
    deployments: ["mainnet-beta"],
  },
  CJsLwbP1iu5DuUikHEJnLfANgKy6stB2uFgvBBHoyxwz: {
    name: PROGRAM_NAMES.SOLANART,
    deployments: ["mainnet-beta"],
  },
  "5ZfZAwP2m93waazg8DkrrVmsupeiPEvaEHowiUP7UAbJ": {
    name: PROGRAM_NAMES.SOLANART_GO,
    deployments: ["mainnet-beta"],
  },
  Dooar9JkhdZ7J3LHN3A7YCuoGRUggXhQaG4kijfLGU2j: {
    name: PROGRAM_NAMES.STEPN_DEX,
    deployments: ["mainnet-beta"],
  },
};

export type LoaderName = typeof LOADER_IDS[keyof typeof LOADER_IDS];
export const LOADER_IDS = {
  MoveLdr111111111111111111111111111111111111: "Move Loader",
  NativeLoader1111111111111111111111111111111: "Native Loader",
  [BPF_LOADER_DEPRECATED_PROGRAM_ID.toBase58()]: "BPF Loader",
  [BPF_LOADER_PROGRAM_ID.toBase58()]: "BPF Loader 2",
  BPFLoaderUpgradeab1e11111111111111111111111: "BPF Upgradeable Loader",
} as const;
