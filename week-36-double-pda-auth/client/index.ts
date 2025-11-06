import {
  Connection, Keypair, PublicKey,
  SystemProgram, Transaction, TransactionInstruction,
  sendAndConfirmTransaction
} from "@solana/web3.js";

// The deployed program's public key (on-chain address).
// This must match the `Program Id:` printed after `solana program deploy`.
export const PROGRAM_ID = new PublicKey("Y24ydQSoWFNvdgmmeVfKKV4urNLf3B34ho8BpTctzhN");


// Derive a PDA (Program Derived Address) for storing the counter.
// PDA = hash("counter" + authority public key + bump)
// The PDA does NOT have a private key — your program signs for it using invoke_signed().
export function pdaFor(authority: PublicKey) {
  const [pda, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from("counter"), authority.toBuffer()], // seeds
    PROGRAM_ID                                     // program that owns the PDA
  );
  return { pda, bump };
}


// Initialize the PDA account and set counter = 0 on-chain.
export async function init(connection: Connection, authority: Keypair) {
  // Compute PDA and bump for this user/authority.
  const { pda, bump } = pdaFor(authority.publicKey);

  // Build the Init instruction.
  const ix = new TransactionInstruction({
    programId: PROGRAM_ID, // Send instruction to our program

    // Accounts passed to the program (must match Rust account order)
    keys: [
      { pubkey: authority.publicKey, isSigner: true, isWritable: true }, // payer + signer
      { pubkey: pda, isSigner: false, isWritable: true },               // PDA to be created
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false } // Needed for create_account
    ],

    // Instruction data: opcode 0 = Init, followed by bump byte.
    data: Buffer.from([0, bump]),
  });

  // Send transaction.
  const tx = new Transaction().add(ix);
  tx.feePayer = authority.publicKey;

  // Authority signs (NOT the PDA).
  await sendAndConfirmTransaction(connection, tx, [authority]);

  return { authority, pda, bump };
}


// Send Update instruction → if counter = 0 → set to 1, else multiply by 2.
export async function update(connection: Connection, authority: Keypair) {
  const { pda, bump } = pdaFor(authority.publicKey);

  const ix = new TransactionInstruction({
    programId: PROGRAM_ID,
    keys: [
      { pubkey: authority.publicKey, isSigner: true, isWritable: false }, // signer
      { pubkey: pda, isSigner: false, isWritable: true },                 // stored counter
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }
    ],
    data: Buffer.from([1, bump]), // opcode 1 = Update
  });

  const tx = new Transaction().add(ix);
  tx.feePayer = authority.publicKey;

  await sendAndConfirmTransaction(connection, tx, [authority]);

  return pda;
}
