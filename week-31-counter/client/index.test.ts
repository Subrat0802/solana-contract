import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import * as borsh from "borsh";
import {expect, test} from "bun:test";
import { CounterAccount, GREETING_SIZE, schema } from "./instruction";

const userAccount = new Keypair();
const dataAccount = new Keypair();
const connection = new Connection("http://127.0.0.1:8899");
const program_id = new PublicKey("CX9D8eGqd4EVVshESUuNpQGtjmsickHtV6v2SjuLPCWL");

test("init account", async () => {
    const response = await connection.requestAirdrop(userAccount.publicKey, 1 * LAMPORTS_PER_SOL);
    await connection.confirmTransaction(response);

    const lamport = await connection.getMinimumBalanceForRentExemption(GREETING_SIZE);

    const ix = SystemProgram.createAccount({
        fromPubkey:userAccount.publicKey,
        lamports:lamport,
        newAccountPubkey: dataAccount.publicKey,
        programId: program_id,
        space: GREETING_SIZE
    })

    const tx = new Transaction().add(ix);
    const txhash = await connection.sendTransaction(tx, [userAccount, dataAccount]);
    await connection.confirmTransaction(txhash);

    const dataAccInfo = await connection.getAccountInfo(dataAccount.publicKey);
    if(!dataAccInfo){
        throw new Error("Data account not found");
    }

    const counter = borsh.deserialize(schema, dataAccInfo?.data) as CounterAccount;
    console.log(counter.count);
    expect(counter.count).toBe(0);

})

test("add counter value", async () => {
    const tx = new Transaction();

    tx.add(new TransactionInstruction({
        keys:[
            {
                pubkey: dataAccount.publicKey, 
                isSigner: false,
                isWritable: true
            }
        ],
        programId: program_id,
        data: Buffer.from(new Uint8Array([0,1,0,0,0]))
    }));

    const txhash = await connection.sendTransaction(tx, [userAccount]);
    await connection.confirmTransaction(txhash);
    console.log(txhash);

    const dataAccInfo = await connection.getAccountInfo(dataAccount.publicKey);

     
    if(!dataAccInfo){
        throw new Error("Data account not found");
    }

    const counter = await borsh.deserialize(schema, dataAccInfo?.data) as CounterAccount;
    console.log(counter.count);
    expect(counter.count).toBe(1);
})

test("dec counter value", async () => {
    const tx = new Transaction();

    tx.add(new TransactionInstruction({
        keys:[
            {
                pubkey: dataAccount.publicKey, 
                isSigner: false,
                isWritable: true
            }
        ],
        programId: program_id,
        data: Buffer.from(new Uint8Array([1,1,0,0,0]))
    }));

    const txhash = await connection.sendTransaction(tx, [userAccount]);
    await connection.confirmTransaction(txhash);
    console.log(txhash);

    const dataAccInfo = await connection.getAccountInfo(dataAccount.publicKey);

    if(!dataAccInfo){
        throw new Error("Data account not found");
    }

    const counter = await borsh.deserialize(schema, dataAccInfo.data) as CounterAccount;
    console.log(counter.count);
    expect(counter.count).toBe(0);
})