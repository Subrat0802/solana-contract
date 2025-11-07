// import { Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
// import {expect, test} from "bun:test";
// import { LiteSVM } from "litesvm";


// test("init data account", async () => {
//     const svm = new LiteSVM();
//     const contractPubkey = PublicKey.unique();
//     svm.addProgramFromFile(contractPubkey, "./double-har.so");
//     const payer = new Keypair();
//     svm.airdrop(payer.publicKey, BigInt(LAMPORTS_PER_SOL));
//     const dataAcc = new Keypair();
//     const blockhash = svm.latestBlockhash();

//     const ix = [
//         SystemProgram.createAccount({
//             fromPubkey: payer.publicKey,
//             newAccountPubkey: dataAcc.publicKey,
//             lamports: Number(svm.minimumBalanceForRentExemption(BigInt(4))),
//             programId: contractPubkey,
//             space: 4
//         }),
//     ];

//     function doubleCounter() {
//         const tx = new Transaction();
//         tx.recentBlockhash = blockhash;
//         tx.add(...ix);
//         tx.sign(payer, dataAcc);
//         svm.sendTransaction(tx);
//         const balanceAfter = svm.getBalance(dataAcc.publicKey);
//         expect(balanceAfter).toBe(svm.minimumBalanceForRentExemption(BigInt(4)));

//         const ix2 = new TransactionInstruction({
//             keys:[
//                 {
//                     pubkey: dataAcc.publicKey,
//                     isSigner: false,
//                     isWritable: true
//                 }
//             ],
//             programId: contractPubkey,
//             data: Buffer.from("")
//         });
//         const blockhash2 = svm.latestBlockhash();
//         const tx2 = new Transaction().add(ix2);
//         tx2.recentBlockhash = blockhash2;
//         tx2.sign(payer);
//         svm.sendTransaction(tx2);
//         svm.expireBlockhash();
//     }

//     doubleCounter();
//     doubleCounter();
//     doubleCounter();
//     doubleCounter();

//     const newDataAcc = svm.getAccount(dataAcc.publicKey);

//     console.log(newDataAcc?.data);

//     expect(newDataAcc?.data[0]).toBe(8);
//     expect(newDataAcc?.data[1]).toBe(0);
//     expect(newDataAcc?.data[2]).toBe(0);
//     expect(newDataAcc?.data[3]).toBe(0);
// })