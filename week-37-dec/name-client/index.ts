import { Connection, Keypair, LAMPORTS_PER_SOL, SystemProgram, Transaction } from "@solana/web3.js";

const connection = new Connection("http://127.0.0.1:8899", "confirmed");

async function main() {
    const kp = new Keypair();
    const dataAcc = new Keypair();

    const res = await connection.requestAirdrop(kp.publicKey, 3 * LAMPORTS_PER_SOL);
    await connection.confirmTransaction(res);
    
    const ix = SystemProgram.createAccount({
        fromPubkey: kp.publicKey,
        newAccountPubkey: dataAcc.publicKey,
        lamports: 1000_000_000,
        space: 8,
        programId: SystemProgram.programId
    })
    const {blockhash} = await connection.getLatestBlockhash();
    const tx = new Transaction();
    tx.add(ix);
    tx.feePayer = kp.publicKey;
    tx.recentBlockhash = blockhash;
    tx.sign(kp);

    const txhash = await connection.sendTransaction(tx, [kp, dataAcc]);
    await connection.confirmTransaction(txhash);
    console.log(dataAcc.publicKey.toBase58())

    const bal = await connection.getBalance(dataAcc.publicKey);
    console.log("bal data account", bal);
}

main();