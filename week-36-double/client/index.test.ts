import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import {test} from "bun:test";
import { LiteSVM } from "litesvm";

const userAccount = new Keypair();
const dataAccount = new Keypair();
const program_id = new PublicKey("KTEu3q5Jsj27BEEffJkbwqtLUzP37LJkBm4BTyXttki");
const connection = new Connection("http://127.0.0.1:8899");

test("init data account", async () => {

    const svm = new LiteSVM();
    const reqAirdrop = await connection.requestAirdrop(userAccount.publicKey, LAMPORTS_PER_SOL);
    await connection.confirmTransaction(reqAirdrop);
    
    let ix = SystemProgram.createAccount({
        fromPubkey: userAccount.publicKey,
        newAccountPubkey: dataAccount.publicKey,
        lamports: Number(svm.minimumBalanceForRentExemption(BigInt(4))),
        space: 4,
        programId: program_id
    });

    const tx = new Transaction().add(ix);
    const { blockhash } = await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = userAccount.publicKey;

    const sig = await sendAndConfirmTransaction(
    connection,
    tx,
    [userAccount, dataAccount]
    );
    console.log("Transaction Signature:", sig);
})

test("double counter value makes it 1 for the first time", async () => {
    const tx = new Transaction();
    
    tx.add(new TransactionInstruction({
        keys:[
            {
                pubkey: dataAccount.publicKey,
                isSigner:true,
                isWritable: true
            }
        ],
        programId:program_id,
        data: Buffer.from([])
    }));

    const {blockhash} = await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = userAccount.publicKey;
    tx.sign(userAccount, dataAccount);
    const sig = await sendAndConfirmTransaction(
        connection,
        tx,
        [userAccount, dataAccount]
    );
    console.log("assign value 1", sig);
})

test("double counter value makes it 8 after 4 times", async () => {
    const tx = new Transaction();
    tx.add(new TransactionInstruction({
        keys:[
            {
                pubkey: dataAccount.publicKey,
                isSigner:true,
                isWritable:true
            }
        ],
        programId: program_id,
        data: Buffer.from([])
    }));

    const {blockhash} = await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = userAccount.publicKey;
    tx.sign(userAccount, dataAccount);
    const sig = await sendAndConfirmTransaction(
        connection,
        tx,
        [userAccount, dataAccount]
    );
    console.log("assign value 1", sig);
})