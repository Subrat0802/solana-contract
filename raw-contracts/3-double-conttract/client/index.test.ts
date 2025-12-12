import { Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import {test, expect} from "bun:test";
import { LiteSVM } from "litesvm";

const svm = new LiteSVM();
const programId = PublicKey.unique();
svm.addProgramFromFile(programId, "./doubledecnew.so");

const dataAccount = new Keypair();
const userAccount = new Keypair();

test("init", async () => {
    const response = svm.airdrop(userAccount.publicKey, BigInt(1000000000));
    const tx = new Transaction();
    tx.add(
        SystemProgram.createAccount({
            fromPubkey: userAccount.publicKey,
            newAccountPubkey: dataAccount.publicKey,
            lamports: Number(svm.minimumBalanceForRentExemption(BigInt(4))),
            space: 4,
            programId: programId
        })
    );

    tx.recentBlockhash = svm.latestBlockhash();
    tx.sign(userAccount, dataAccount);
    const txhash = svm.sendTransaction(tx);
    console.log(txhash.toString());
    const dataAccountInfo = svm.getAccount(dataAccount.publicKey);
    console.log(dataAccountInfo?.data);
})

test("double", async () => {
    const tx = new Transaction();
    tx.add(new TransactionInstruction({
        keys:[
            {pubkey: userAccount.publicKey, isSigner: true, isWritable: false},
            {pubkey: dataAccount.publicKey, isSigner:false, isWritable: true}
        ],
        programId:programId,
        data: Buffer.from([])
    }));

    tx.recentBlockhash = svm.latestBlockhash();
    tx.sign(userAccount);
    svm.sendTransaction(tx);
    svm.expireBlockhash();

    const dataAccountInfo = svm.getAccount(dataAccount.publicKey);
    console.log(dataAccountInfo?.data);
})

test("double", async () => {
    const tx = new Transaction();
    tx.add(new TransactionInstruction({
        keys:[
            {pubkey: userAccount.publicKey, isSigner: true, isWritable: false},
            {pubkey: dataAccount.publicKey, isSigner:false, isWritable: true}
        ],
        programId:programId,
        data: Buffer.from([])
    }));

    tx.recentBlockhash = svm.latestBlockhash();
    tx.sign(userAccount);
    svm.sendTransaction(tx);
    svm.expireBlockhash();

    const dataAccountInfo = svm.getAccount(dataAccount.publicKey);
    console.log(dataAccountInfo?.data);
})

test("double", async () => {
    const tx = new Transaction();
    tx.add(new TransactionInstruction({
        keys:[
            {pubkey: userAccount.publicKey, isSigner: true, isWritable: false},
            {pubkey: dataAccount.publicKey, isSigner:false, isWritable: true}
        ],
        programId:programId,
        data: Buffer.from([])
    }));

    tx.recentBlockhash = svm.latestBlockhash();
    tx.sign(userAccount);
    svm.sendTransaction(tx);
    svm.expireBlockhash();

    const dataAccountInfo = svm.getAccount(dataAccount.publicKey);
    console.log(dataAccountInfo?.data);
})
