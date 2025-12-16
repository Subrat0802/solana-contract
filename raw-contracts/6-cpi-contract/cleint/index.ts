// import { Keypair, PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
// import {test, describe, beforeAll, expect} from "bun:test";
// import { LiteSVM } from "litesvm";


// describe("create pda for client", () => {
//     let svm: LiteSVM;
//     let pda: PublicKey;
//     let bump: Number;
//     let programId: PublicKey;
//     let payer: Keypair
    
//     beforeAll(async () => {
//         svm = new LiteSVM();
//         programId = PublicKey.unique();
//         payer = new Keypair();
//         svm.addProgramFromFile(programId, "./cpidoubledecnew.so")
//         svm.airdrop(payer.publicKey, BigInt(1000000000));

//         const [pda, bump] = await PublicKey.findProgramAddressSync(
//             [payer.publicKey.toBuffer(), Buffer.from("user")],
//             programId
//         );

//         console.log("pda bump", pda, bump);

//         const tx = new Transaction();
//         tx.add(new TransactionInstruction({
//             keys:[
//                 {
//                     pubkey: payer.publicKey,
//                     isSigner: true,
//                     isWritable: false
//                 },
//                 {
//                     pubkey: pda,
//                     isSigner: false,
//                     isWritable: true
//                 },
//                 {
//                     pubkey: SystemProgram.programId,
//                     isSigner: false,
//                     isWritable: false
//                 }
//             ],
//             programId,
//             data: Buffer.from("")
//         }));

//         tx.recentBlockhash = svm.latestBlockhash();
//         tx.feePayer = payer.publicKey;
//         tx.sign(payer);
//         let res = svm.sendTransaction(tx);

//         const pdaAccount = svm.getAccount(pda);
//         console.log(pdaAccount?.lamports);
//         console.log(pdaAccount?.owner);
//         expect(pdaAccount?.owner).toBe(programId);
//     })
// })

