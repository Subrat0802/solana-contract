import { Keypair, PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import {beforeAll, describe, test} from "bun:test";
import { LiteSVM } from "litesvm";


describe("cpi to raw contract",  () => {
    let svm: LiteSVM;
    let userAcc: Keypair;
    let dataAcc: Keypair;
    let programId: PublicKey;

    beforeAll(async () => {
        svm = new LiteSVM();
        programId = PublicKey.unique();
        dataAcc = new Keypair();
        userAcc = new Keypair();

        svm.addProgramFromFile( programId, "./cpidecnewanchor2.so");
        svm.airdrop(userAcc.publicKey, BigInt(1000000000));
        console.log(svm.getBalance(userAcc.publicKey));

        const tx = new Transaction();
        tx.add(new TransactionInstruction({
            keys:[
                {pubkey: userAcc.publicKey, isSigner: true, isWritable: false},
                {pubkey: dataAcc.publicKey, isSigner: true, isWritable: true},
                {pubkey: SystemProgram.programId, isSigner: false, isWritable: false}
            ],
            programId,
            data: Buffer.from(new Uint8Array([0]))
        }));

        tx.recentBlockhash = svm.latestBlockhash();
        tx.sign(userAcc, dataAcc);
        tx.feePayer = userAcc.publicKey;
        let txhash = svm.sendTransaction(tx);
        // console.log(txhash.toString());
        let dataAccountInfo = svm.getAccount(dataAcc.publicKey);
        console.log("dataAccountInfo", dataAccountInfo);
    })
    
    test("double value", () => {
        const tx = new Transaction();
        tx.add(new TransactionInstruction({
            keys:[
                {pubkey: dataAcc.publicKey, isSigner: false, isWritable: true},
                {pubkey: userAcc.publicKey, isSigner: true, isWritable: false},
            ],
            programId,
            data: Buffer.from(new Uint8Array([1]))
        }))

        tx.recentBlockhash = svm.latestBlockhash();
        tx.sign(userAcc);
        tx.feePayer = userAcc.publicKey;
        const txhahsh = svm.sendTransaction(tx);
        const dataInfo = svm.getAccount(dataAcc.publicKey);
        svm.expireBlockhash();
        console.log(dataInfo);
        
    })
    test("double value again", () => {
        const tx = new Transaction();
        tx.add(new TransactionInstruction({
            keys:[
                {pubkey: dataAcc.publicKey, isSigner: false, isWritable: true},
                {pubkey: userAcc.publicKey, isSigner: true, isWritable: false},
            ],
            programId,
            data: Buffer.from(new Uint8Array([1]))
        }))

        tx.recentBlockhash = svm.latestBlockhash();
        tx.sign(userAcc);
        tx.feePayer = userAcc.publicKey;
        const txhahsh = svm.sendTransaction(tx);
        const dataInfo = svm.getAccount(dataAcc.publicKey);
        svm.expireBlockhash();
        console.log(dataInfo);

    })

    test("half value", () => {
        const tx = new Transaction();
        tx.add(new TransactionInstruction({
            keys:[
                {pubkey: dataAcc.publicKey, isSigner: false, isWritable: true},
                {pubkey: userAcc.publicKey, isSigner: true, isWritable: false},
            ],
            programId,
            data: Buffer.from(new Uint8Array([2]))
        }))

        tx.recentBlockhash = svm.latestBlockhash();
        tx.sign(userAcc);
        tx.feePayer = userAcc.publicKey;
        const txhahsh = svm.sendTransaction(tx);
        const dataInfo = svm.getAccount(dataAcc.publicKey);
        svm.expireBlockhash();
        console.log(dataInfo);
    })

})



