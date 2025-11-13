import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import {test} from "bun:test";
import { FAV_GREETING_SIZE, FavAccount, favSchema } from "./instrfav";
import { encodeFavourite } from "./encodeFavourite";
import * as borsh from "borsh"
import { schema } from "./instructions";


const userAccount = new Keypair();
const dataAccount = new Keypair();
const connection = new Connection("http://localhost:8899", "confirmed");
const programId = new PublicKey("6EyHWgS8WNJefBsh7PJXP6JxNw1V1UYEWeVqGYHCiKWu");

test("init account", async () => {
    const resposne = await connection.requestAirdrop(userAccount.publicKey, 1 * LAMPORTS_PER_SOL);
    await connection.confirmTransaction(resposne);
    const ACCOUNT_SIZE = 100;
    const lamports = await connection.getMinimumBalanceForRentExemption(ACCOUNT_SIZE);
    
    const tx = new Transaction();
    tx.add(
        SystemProgram.createAccount({
            fromPubkey: userAccount.publicKey,
            lamports: lamports,
            newAccountPubkey: dataAccount.publicKey,
            programId: programId,
            space: ACCOUNT_SIZE
        })
    )

    const txhash = await connection.sendTransaction(tx, [userAccount, dataAccount]);
    const res = await connection.confirmTransaction(txhash);

    console.log("txhash", txhash);
    console.log("res", res);
})

test("send Data", async () => {
    const instructions = encodeFavourite("subrat", "red", 27);

    const tx = new Transaction();
    tx.add(
        new TransactionInstruction({
            keys: [
                {
                    pubkey: dataAccount.publicKey,
                    isSigner: false,
                    isWritable: true,
                },
            ],
            programId: programId,
            data: instructions,
        })
    );

    const txhash = await connection.sendTransaction(tx, [userAccount]);
    await connection.confirmTransaction(txhash);

    const dataAccountInfo = await connection.getAccountInfo(dataAccount.publicKey);

    if(!dataAccountInfo){
        throw new Error("no account found");
    }

    const favData = borsh.deserialize(favSchema, dataAccountInfo.data) as FavAccount;
    console.log(favData);
});
