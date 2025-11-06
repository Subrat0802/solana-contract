import { test, expect } from "bun:test";
import { init, update, pdaFor } from "./index";
import {
  Connection, Keypair, LAMPORTS_PER_SOL
} from "@solana/web3.js";

test("counter PDA increments & doubles (RPC)", async () => {
  // Connect to your local Solana validator
  const connection = new Connection("http://127.0.0.1:8899", "confirmed");

  // Create a test wallet
  const authority = Keypair.generate();

  // Airdrop SOL so the wallet can pay rent + transaction fees
  const sig = await connection.requestAirdrop(authority.publicKey, LAMPORTS_PER_SOL);
  const blockhash = await connection.getLatestBlockhash();
  await connection.confirmTransaction({ signature: sig, ...blockhash });

  // Initialize the PDA counter (starts at 0)
  await init(connection, authority);

  // Perform 4 updates:
  // 0 → 1 → 2 → 4 → 8
  await update(connection, authority);
  await update(connection, authority);
  await update(connection, authority);
  await update(connection, authority);

  // Get the PDA address so we can read it
  const { pda } = pdaFor(authority.publicKey);

  // Fetch the PDA data from the blockchain
  const acc = await connection.getAccountInfo(pda);
  if (!acc) throw new Error("PDA not found");

  // Value is stored as a u32 (4 bytes) in little-endian format
  const value = acc.data.readUInt32LE(0);

  // Confirm that final value is 8
  expect(value).toBe(8);
});


/* 
🎯 What You Just Built
Concept	                    Meaning
PDA	                        Account controlled by your program, not a wallet
Init Instruction	        Creates the PDA and initializes state
Update Instruction	        Executes business logic on stored state
Tests	                    Verify program behavior end-to-end against validator

This is real Solana dev skill. You've moved from keypair storage → PDA-based, secure, deterministic, 
real-world program architecture. 🚀
*/