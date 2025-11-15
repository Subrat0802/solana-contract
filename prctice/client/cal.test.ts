import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import {test} from "bun:test";
import { CounterAccount, GREETING_SIZE, schema } from "./instructions";
import * as borsh from "borsh";

const userAccount = new Keypair();
const dataAccount = new Keypair();
const programId = new PublicKey("EhjQA9kFheGU7qz5jd57RRXTwGgAHE6oKhLeDGmqhkkr");
const connection = new Connection("http://localhost:8899", "confirmed");

test("init counter account", async () => {
    const response = await connection.requestAirdrop(userAccount.publicKey, 1*LAMPORTS_PER_SOL);
    await connection.confirmTransaction(response);

    const lamports = await connection.getMinimumBalanceForRentExemption(GREETING_SIZE);

    const tx = new Transaction();
    tx.add( SystemProgram.createAccount({
        fromPubkey: userAccount.publicKey,
        newAccountPubkey: dataAccount.publicKey,
        lamports: lamports,
        space: GREETING_SIZE,
        programId: programId
    }))

    const txhash = await connection.sendTransaction(tx, [userAccount, dataAccount]);
    const res = await connection.confirmTransaction(txhash);
    
    const dataAccountInfo = await connection.getAccountInfo(dataAccount.publicKey);
    if(!dataAccountInfo){
        throw new Error("Data account not found");
    }

    const counter = borsh.deserialize(schema, dataAccountInfo.data) as CounterAccount;
    console.log(counter?.count)
})


test("do calculation", async () => {

    async function addValue() {
        const tx = new Transaction();
        tx.add(new TransactionInstruction({
            keys:[
                {
                    pubkey: dataAccount.publicKey,
                    isSigner: false,
                    isWritable: true
                }
            ],
            programId: programId,
            data: Buffer.from(new Uint8Array([0,1,0,0,0]))
        }))
        const {blockhash, lastValidBlockHeight} = await connection.getLatestBlockhash();
        tx.recentBlockhash = blockhash;
        tx.feePayer = userAccount.publicKey;
        const txhash = await connection.sendTransaction(tx, [userAccount]);
        const response = await connection.confirmTransaction({signature:txhash, blockhash, lastValidBlockHeight});

        
    }

    await addValue();
    await addValue();
    await addValue();
    await addValue();
    

    const dataAccountInfo = await connection.getAccountInfo(dataAccount.publicKey);
    if(!dataAccountInfo){
        throw new Error("data account not found");
    }

    const counter = borsh.deserialize(schema, dataAccountInfo.data) as CounterAccount;
    console.log(counter.count);
})


test("sub", async () => {
    const tx = new Transaction();
    tx.add(new TransactionInstruction({
        keys:[{
            pubkey: dataAccount.publicKey,
            isSigner:false,
            isWritable:true
        }],
        programId: programId,
        data: Buffer.from(new Uint8Array([1,1,0,0,0]))
    }))

    const {blockhash, lastValidBlockHeight} = await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = userAccount.publicKey;
    const txhash = await connection.sendTransaction(tx, [userAccount]);
    const res = await connection.confirmTransaction({signature:txhash, blockhash, lastValidBlockHeight});

    const dataAccountInfo = await connection.getAccountInfo(dataAccount.publicKey);
    if(!dataAccountInfo){
        throw new Error("Data account not found");
    }

    const counter = borsh.deserialize(schema, dataAccountInfo.data) as CounterAccount;
    console.log(counter.count);
})


test("mul", async () => {
    const tx = new Transaction();
    tx.add(new TransactionInstruction({
        keys:[{
            pubkey: dataAccount.publicKey,
            isSigner:false,
            isWritable:true
        }],
        programId: programId,
        data: Buffer.from(new Uint8Array([2,10,0,0,0]))
    }))

    const {blockhash, lastValidBlockHeight} = await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = userAccount.publicKey;
    const txhash = await connection.sendTransaction(tx, [userAccount]);
    const res = await connection.confirmTransaction({signature:txhash, blockhash, lastValidBlockHeight});

    const dataAccountInfo = await connection.getAccountInfo(dataAccount.publicKey);
    if(!dataAccountInfo){
        throw new Error("Data account not found");
    }

    const counter = borsh.deserialize(schema, dataAccountInfo.data) as CounterAccount;
    console.log(counter.count);
})


test("div", async () => {
    const tx = new Transaction();
    tx.add(new TransactionInstruction({
        keys:[{
            pubkey: dataAccount.publicKey,
            isSigner:false,
            isWritable:true
        }],
        programId: programId,
        data: Buffer.from(new Uint8Array([3,3,0,0,0]))
    }))

    const {blockhash, lastValidBlockHeight} = await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = userAccount.publicKey;
    const txhash = await connection.sendTransaction(tx, [userAccount]);
    const res = await connection.confirmTransaction({signature:txhash, blockhash, lastValidBlockHeight});

    const dataAccountInfo = await connection.getAccountInfo(dataAccount.publicKey);
    if(!dataAccountInfo){
        throw new Error("Data account not found");
    }

    const counter = borsh.deserialize(schema, dataAccountInfo.data) as CounterAccount;
    console.log(counter.count);
})