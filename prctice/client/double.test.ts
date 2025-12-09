// import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
// import * as borsh from "borsh";
// import {test, expect} from "bun:test";
// import { CounterAccount, GREETING_SIZE, schema } from "./instructions";

// const userAccount = new Keypair();
// const dataAccount = new Keypair();
// const connection = new Connection("http://127.0.0.1:8899", "confirmed");
// const programId = new PublicKey("CupiYD8x2M5qFBQVcwTrKbFuvL5vyLBfknirZ1vfLFqV");

// test("init account", async () => {

//     const response = await connection.requestAirdrop(userAccount.publicKey, 1 * LAMPORTS_PER_SOL);
//     await connection.confirmTransaction(response);

//     const lamports = await connection.getMinimumBalanceForRentExemption(GREETING_SIZE);

//     const tx = new Transaction();
//     tx.add(new TransactionInstruction(
//         SystemProgram.createAccount({
//             fromPubkey: userAccount.publicKey,
//             lamports: lamports,
//             newAccountPubkey: dataAccount.publicKey,
//             space: GREETING_SIZE,
//             programId: programId
//         })
//     ))

//     const txhash = await connection.sendTransaction(tx, [userAccount, dataAccount]);
//     await connection.confirmTransaction(txhash);

//     const dataAccountInfo = await connection.getAccountInfo(dataAccount.publicKey);
//     if(!dataAccountInfo){
//         throw new Error("data account not found");
//     }

//     const counter = await borsh.deserialize(schema, dataAccountInfo?.data) as CounterAccount;
//     console.log(counter.count);
//     expect(counter.count).toBe(0);

// })



// test("make it 1 for the first time", async () => {
//     const tx = new Transaction();
//     tx.add(new TransactionInstruction({
//         keys: [{
//             pubkey: dataAccount.publicKey,
//             isWritable: true,
//             isSigner: false
//         }],
//         programId: programId,
//         data: Buffer.from([])
//     }))

//     const txhash = await connection.sendTransaction(tx, [userAccount]);
//     await connection.confirmTransaction(txhash);

//     const dataAccountInfo = await connection.getAccountInfo(dataAccount.publicKey);
//     if(!dataAccountInfo?.data){
//         throw new Error("data account not found");
//     }

//     const counter = borsh.deserialize(schema, dataAccountInfo?.data) as CounterAccount;
//     console.log(counter.count);
//     expect(counter.count).toBe(1);
// })



// test("make it 2 for the second time", async () => {
//     const tx = new Transaction();
//     tx.add(new TransactionInstruction({
//         keys: [{
//             pubkey: dataAccount.publicKey,
//             isWritable: true,
//             isSigner: false
//         }],
//         programId: programId,
//         data: Buffer.from([])
//     }))

//     const txhash = await connection.sendTransaction(tx, [userAccount]);
//     await connection.confirmTransaction(txhash);

//     const dataAccountInfo = await connection.getAccountInfo(dataAccount.publicKey);
//     if(!dataAccountInfo?.data){
//         throw new Error("data account not found");
//     }

//     const counter = borsh.deserialize(schema, dataAccountInfo?.data) as CounterAccount;
//     console.log(counter.count);
//     expect(counter.count).toBe(2);
// })







//=+++++++++++++++++++++
// import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
// import {test} from "bun:test";
// import { CounterAccount, GREETING_SIZE, schema } from "./instructions";
// import * as borsh from "borsh";


// const userAccount = new Keypair();
// const dataAccount = new Keypair();
// const programId = new PublicKey("G3b5maymncjJBfuJX457si2bfix3XJiH5nAkDj8T8pZ6");
// const connection = new Connection("http://localhost:8899", "confirmed");

// test("init account", async () => {
//     const response = await connection.requestAirdrop(userAccount.publicKey, 1 * LAMPORTS_PER_SOL);
//     await connection.confirmTransaction(response);
    
//     const lamports = await connection.getMinimumBalanceForRentExemption(GREETING_SIZE);

//     const tx = new Transaction();
//     tx.add(
//         SystemProgram.createAccount({
//             fromPubkey: userAccount.publicKey,
//             lamports: lamports,
//             newAccountPubkey: dataAccount.publicKey,
//             programId: programId,
//             space: GREETING_SIZE
//         })
//     );

//     const txhash = await connection.sendTransaction(tx, [userAccount, dataAccount]);
//     await connection.confirmTransaction(txhash);

//     console.log(txhash);
// })


// test("double value", async () => {
//     const tx = new Transaction();
//     tx.add(new TransactionInstruction({
//         keys:[
//             {
//                 pubkey: dataAccount.publicKey,
//                 isSigner: true,
//                 isWritable: true
//             }
//         ],
//         programId,
//         data:Buffer.from([])
//     }));

//     const txhash = await connection.sendTransaction(tx, [userAccount, dataAccount]);
//     await connection.confirmTransaction(txhash);
//     console.log(txhash);
// })


// test("double value 4 times", async () => {

//     async function doubleit() {
//         const tx = new Transaction();
//         tx.add(new TransactionInstruction({
//             keys: [
//                 {
//                     pubkey: dataAccount.publicKey,
//                     isSigner: true,
//                     isWritable: true
//                 }
//             ],
//             programId,
//             data: Buffer.from([])
//         }));
        
//         const txhash = await connection.sendTransaction(tx, [userAccount, dataAccount]);
//         await connection.confirmTransaction(txhash);
//         console.log("Tx:", txhash);
//     }

//     // 🔥 call 4 times in sequence
//     await doubleit();
//     await doubleit();
//     await doubleit();
//     await doubleit();

//     // read final account value
//     const info = await connection.getAccountInfo(dataAccount.publicKey);
//     if(!info){
//         return
//     }
//     const counter = borsh.deserialize(schema, info.data);
//     //@ts-ignore
//     console.log("Final count:", counter?.count);
// });
