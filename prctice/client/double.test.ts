import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import {test} from "bun:test";
import { CounterAccount, GREETING_SIZE, schema } from "./instructions";
import * as borsh from "borsh";


const userAccount = new Keypair();
const dataAccount = new Keypair();
const programId = new PublicKey("G3b5maymncjJBfuJX457si2bfix3XJiH5nAkDj8T8pZ6");
const connection = new Connection("http://localhost:8899", "confirmed");

test("init account", async () => {
    const response = await connection.requestAirdrop(userAccount.publicKey, 1 * LAMPORTS_PER_SOL);
    await connection.confirmTransaction(response);
    
    const lamports = await connection.getMinimumBalanceForRentExemption(GREETING_SIZE);

    const tx = new Transaction();
    tx.add(
        SystemProgram.createAccount({
            fromPubkey: userAccount.publicKey,
            lamports: lamports,
            newAccountPubkey: dataAccount.publicKey,
            programId: programId,
            space: GREETING_SIZE
        })
    );

    const txhash = await connection.sendTransaction(tx, [userAccount, dataAccount]);
    await connection.confirmTransaction(txhash);

    console.log(txhash);
})


test("double value", async () => {
    const tx = new Transaction();
    tx.add(new TransactionInstruction({
        keys:[
            {
                pubkey: dataAccount.publicKey,
                isSigner: true,
                isWritable: true
            }
        ],
        programId,
        data:Buffer.from([])
    }));

    const txhash = await connection.sendTransaction(tx, [userAccount, dataAccount]);
    await connection.confirmTransaction(txhash);
    console.log(txhash);
})


test("double value 4 times", async () => {

    async function doubleit() {
        const tx = new Transaction();
        tx.add(new TransactionInstruction({
            keys: [
                {
                    pubkey: dataAccount.publicKey,
                    isSigner: true,
                    isWritable: true
                }
            ],
            programId,
            data: Buffer.from([])
        }));
        
        const txhash = await connection.sendTransaction(tx, [userAccount, dataAccount]);
        await connection.confirmTransaction(txhash);
        console.log("Tx:", txhash);
    }

    // 🔥 call 4 times in sequence
    await doubleit();
    await doubleit();
    await doubleit();
    await doubleit();

    // read final account value
    const info = await connection.getAccountInfo(dataAccount.publicKey);
    if(!info){
        return
    }
    const counter = borsh.deserialize(schema, info.data);
    //@ts-ignore
    console.log("Final count:", counter?.count);
});
