import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import {test, expect} from "bun:test";
import { CounterAccount, GREETING_SIZE, schema } from "./instruction";
import * as borsh from "borsh";

const userAccount = new Keypair();
const dataAccount = new Keypair();
const programId = new PublicKey("EKN6k7Nn724AfZcnupbjnNtuimbmUaEYxBrRPGB9DU8c");
const connection = new Connection("http://127.0.0.1:8899", "confirmed");

test("init account", async () => {
    const response = await connection.requestAirdrop(userAccount.publicKey, 1 * LAMPORTS_PER_SOL);
    await connection.confirmTransaction(response);
    
    const lamports = await connection.getMinimumBalanceForRentExemption(GREETING_SIZE);

    const tx = new Transaction();
    tx.add(new TransactionInstruction(
        SystemProgram.createAccount({
            fromPubkey: userAccount.publicKey,
            newAccountPubkey: dataAccount.publicKey,
            lamports: lamports,
            space: GREETING_SIZE,
            programId: programId
        })
    ))

    const txhash = await connection.sendTransaction(tx, [userAccount, dataAccount]);
    await connection.confirmTransaction(txhash);
    const dataAccountInfo = await connection.getAccountInfo(dataAccount.publicKey);
    if(!dataAccountInfo){
        throw new Error("no data account found");
    }
    const counter = borsh.deserialize(schema, dataAccountInfo.data) as CounterAccount;
    console.log(counter.count);
    expect(counter.count).toBe(0);
})

test("Add value", async () => {
    const tx = new Transaction();
    tx.add(new TransactionInstruction({
        keys:[
            {pubkey: dataAccount.publicKey, isSigner: false, isWritable: true}
        ],
        programId: programId,
        data: Buffer.from(new Uint8Array([0, 1, 0, 0, 0]))
    }))

    const txhash = await connection.sendTransaction(tx, [userAccount]);
    await connection.confirmTransaction(txhash);
    const dataAccountInfo = await connection.getAccountInfo(dataAccount.publicKey);
    if(!dataAccountInfo){
        throw new Error("Data account not found")
    }
    const counter = await borsh.deserialize(schema, dataAccountInfo?.data) as CounterAccount;
    console.log(counter.count);
    expect(counter.count).toBe(1);
})

test("Dec value", async () => {
    const tx = new Transaction();
    tx.add(new TransactionInstruction({
        keys:[
            {pubkey: dataAccount.publicKey, isSigner: false, isWritable: true}
        ],
        programId: programId,
        data: Buffer.from(new Uint8Array([1, 1, 0, 0, 0]))
    }))

    const txhash = await connection.sendTransaction(tx, [userAccount]);
    await connection.confirmTransaction(txhash);
    const dataAccountInfo = await connection.getAccountInfo(dataAccount.publicKey);
    if(!dataAccountInfo){
        throw new Error("Data account not found")
    }
    const counter = await borsh.deserialize(schema, dataAccountInfo?.data) as CounterAccount;
    console.log(counter.count);
    expect(counter.count).toBe(0);
})