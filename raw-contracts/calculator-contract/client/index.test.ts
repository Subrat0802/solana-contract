import {test, expect} from "bun:test";
import { Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import { LiteSVM } from "litesvm";

const svm = new LiteSVM();
const userAccount = new Keypair();
const dataAccount = new Keypair();
const programId = PublicKey.unique();

svm.addProgramFromFile(programId, "./calculatordecnew.so");

test("init account", async () => {
    const res = svm.airdrop(userAccount.publicKey, BigInt(1000000000));
    console.log(svm.getBalance(userAccount.publicKey));

    const tx = new Transaction();
    tx.add(new TransactionInstruction(
        SystemProgram.createAccount({
            fromPubkey: userAccount.publicKey,
            newAccountPubkey: dataAccount.publicKey,
            lamports: Number(svm.minimumBalanceForRentExemption(BigInt(4))),
            space: 4,
            programId: programId
        })
    ))
    tx.recentBlockhash = svm.latestBlockhash();
    tx.sign(userAccount, dataAccount);
    const txhash = svm.sendTransaction(tx);
    console.log(txhash.toString());
    const bal = svm.getBalance(dataAccount.publicKey);
    console.log(bal);
})

test("Init", () => {
    const tx = new Transaction();
    tx.add(new TransactionInstruction({
        keys:[
            {pubkey: userAccount.publicKey, isSigner:true, isWritable:false},
            {pubkey: dataAccount.publicKey, isSigner:false, isWritable:true},
        ],
        programId: programId,
        data: Buffer.from(new Uint8Array([0,0,0,0,0]))
    }))

    tx.recentBlockhash = svm.latestBlockhash();
    tx.sign(userAccount);
    svm.sendTransaction(tx);

    const dataAccountInfo = svm.getAccount(dataAccount.publicKey);
    console.log(dataAccountInfo?.data);
})

test("add", async () => {
    const tx = new Transaction();
    tx.add(new TransactionInstruction({
        keys:[
            {pubkey: userAccount.publicKey, isSigner:true, isWritable:false},
            {pubkey: dataAccount.publicKey, isSigner: false, isWritable: true}
        ],
        programId: programId,
        data: Buffer.from(new Uint8Array([1,10,0,0,0]))
    }))
    tx.recentBlockhash = svm.latestBlockhash();
    tx.sign(userAccount);
    svm.sendTransaction(tx);

    const dataAccountInfo = svm.getAccount(dataAccount.publicKey);
    console.log(dataAccountInfo?.data);
})


test("sub", async () => {
    const tx = new Transaction();
    tx.add(new TransactionInstruction({
        keys:[
            {pubkey: userAccount.publicKey, isSigner:true, isWritable:false},
            {pubkey: dataAccount.publicKey, isSigner: false, isWritable: true}
        ],
        programId: programId,
        data: Buffer.from(new Uint8Array([2,5,0,0,0]))
    }))
    tx.recentBlockhash = svm.latestBlockhash();
    tx.sign(userAccount);
    svm.sendTransaction(tx);

    const dataAccountInfo = svm.getAccount(dataAccount.publicKey);
    console.log(dataAccountInfo?.data);
})

test("mul", async () => {
    const tx = new Transaction();
    tx.add(new TransactionInstruction({
        keys:[
            {pubkey: userAccount.publicKey, isSigner:true, isWritable:false},
            {pubkey: dataAccount.publicKey, isSigner: false, isWritable: true}
        ],
        programId: programId,
        data: Buffer.from(new Uint8Array([3,5,0,0,0]))
    }))
    tx.recentBlockhash = svm.latestBlockhash();
    tx.sign(userAccount);
    svm.sendTransaction(tx);

    const dataAccountInfo = svm.getAccount(dataAccount.publicKey);
    console.log(dataAccountInfo?.data);
})

test("div", async () => {
    const tx = new Transaction();
    tx.add(new TransactionInstruction({
        keys:[
            {pubkey: userAccount.publicKey, isSigner:true, isWritable:false},
            {pubkey: dataAccount.publicKey, isSigner: false, isWritable: true}
        ],
        programId: programId,
        data: Buffer.from(new Uint8Array([4,2,0,0,0]))
    }))
    tx.recentBlockhash = svm.latestBlockhash();
    tx.sign(userAccount);
    svm.sendTransaction(tx);

    const dataAccountInfo = svm.getAccount(dataAccount.publicKey);
    console.log(dataAccountInfo?.data);
})