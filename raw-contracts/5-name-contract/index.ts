import { Connection, Keypair, LAMPORTS_PER_SOL, SystemProgram, Transaction } from "@solana/web3.js";

const connection = new Connection("http://127.0.0.1:8899", "confirmed");

async function main(){
    const userAccount = new Keypair();
    const dataAccount = new Keypair();

    const response = await connection.requestAirdrop(userAccount.publicKey, 3 * LAMPORTS_PER_SOL);
    await connection.confirmTransaction(response);

    const balance = await connection.getBalance(userAccount.publicKey);
    console.log("balance", balance);
    const tx = new Transaction();
    tx.add(SystemProgram.createAccount({
        fromPubkey: userAccount.publicKey,
        newAccountPubkey: dataAccount.publicKey,
        space: 8,
        lamports: 1 * LAMPORTS_PER_SOL,
        programId: SystemProgram.programId
    }))

    const txhash = await connection.sendTransaction(tx, [userAccount, dataAccount]);
    await connection.confirmTransaction(txhash);
    const dataAccountInfo = await connection.getAccountInfo(dataAccount.publicKey)
    console.log(dataAccount.publicKey.toBase58());
    const bal = await connection.getBalance(dataAccount.publicKey);
    console.log(bal);
}
main();
