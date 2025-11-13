// import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
// import {test, expect} from "bun:test";
// import { CounterAccount, GREETING_SIZE, schema } from "./instructions";
// import * as borsh from "borsh";

// const userAccount = new Keypair();
// const dataAccount = new Keypair();
// const program_id = new PublicKey("8bcebWRWSXYhU3ujt99Gq9F4KeeSnjoPLGHaCMdvScHG");
// const connection = new Connection("http://127.0.0.1:8899");

// test("init account", async () => {
//     const response = await connection.requestAirdrop(userAccount.publicKey, 1 * LAMPORTS_PER_SOL);
//     await connection.confirmTransaction(response);
    
//     const lamports = await connection.getMinimumBalanceForRentExemption(GREETING_SIZE);

//     const tx = new Transaction();
//     tx.add(new TransactionInstruction(
//         SystemProgram.createAccount({
//         fromPubkey: userAccount.publicKey,
//         lamports:lamports,
//         newAccountPubkey: dataAccount.publicKey,
//         space: GREETING_SIZE,
//         programId: program_id
//     })
//     ))
    
//     const txhash = await connection.sendTransaction(tx, [userAccount, dataAccount]);
//     await connection.confirmTransaction(txhash);

//     const dataAccountInfo = await connection.getAccountInfo(dataAccount.publicKey);
//     if(!dataAccountInfo){
//         throw new Error("Account not found");
//     }

//     const counter = borsh.deserialize(schema, dataAccountInfo?.data) as CounterAccount;
//     console.log(counter.count);

//     expect(counter.count).toBe(0);

// })

// test("add counter value", async () => {
//     const tx = new Transaction();
//     tx.add(new TransactionInstruction({
//         keys:[
//             {
//                 pubkey: dataAccount.publicKey,
//                 isSigner:false,
//                 isWritable: true
//             }
//         ],
//         programId: program_id,
//         data: Buffer.from(new Uint8Array([0,1,0,0,0]))
//     }));

//     const txhash = await connection.sendTransaction(tx, [userAccount]);
//     await connection.confirmTransaction(txhash);
//     console.log(txhash);

//     const dataAccountInfo = await connection.getAccountInfo(dataAccount.publicKey);
//     if(!dataAccountInfo){
//         throw new Error("Data account not found");
//     }

//     const counter = borsh.deserialize(schema, dataAccountInfo?.data) as CounterAccount;
//     console.log(counter.count);

//     expect(counter.count).toBe(1);
// })

// test("dec counter", async () => {
//     const tx = new Transaction();
//     tx.add(new TransactionInstruction({
//         keys: [
//             {
//                 pubkey: dataAccount.publicKey,
//                 isSigner: false,
//                 isWritable: true
//             }
//         ],
//         programId: program_id,
//         data: Buffer.from(new Uint8Array([1,1,0,0,0]))
//     }))

//     const txhash = await connection.sendTransaction(tx, [userAccount]);
//     await connection.confirmTransaction(txhash);
//     console.log(txhash);

//     const dataAccountInfo = await connection.getAccountInfo(dataAccount.publicKey);
//     if(!dataAccountInfo){
//         throw new Error("Data Account not found");
//     }

//     const counter = borsh.deserialize(schema, dataAccountInfo?.data) as CounterAccount;
//     console.log(counter.count);
//     expect(counter.count).toBe(0);
// })