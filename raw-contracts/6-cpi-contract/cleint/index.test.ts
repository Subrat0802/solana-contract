import { Keypair, PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import {test, describe, beforeAll, expect} from "bun:test";
import { LiteSVM } from "litesvm";


describe("create pda for client", () => {
    let svm: LiteSVM;
    let pda: PublicKey;
    let bump: Number;
    let programId: PublicKey;
    let payer: Keypair
    
    beforeAll(async () => {
        svm = new LiteSVM();
        programId = PublicKey.unique();
        payer = new Keypair();
        svm.addProgramFromFile(programId, "./cpicontractdevnew.so")
        svm.airdrop(payer.publicKey, BigInt(1000000000));

        console.log("payer bal", svm.getBalance(payer.publicKey));

        const [pda, bump] = await PublicKey.findProgramAddressSync(
            [payer.publicKey.toBuffer(), Buffer.from("user")],
            programId
        );

        console.log("pda bump", pda.toBase58(), bump);

        const tx = new Transaction();
        tx.add(new TransactionInstruction({
            keys:[
                {
                    pubkey: payer.publicKey,
                    isSigner: true,
                    isWritable: false
                },
                {
                    pubkey: pda,
                    isSigner: false,
                    isWritable: true
                },
                {
                    pubkey: SystemProgram.programId,
                    isSigner: false,
                    isWritable: false
                }
            ],
            programId,
            data: Buffer.from("")
        }));

        tx.recentBlockhash = svm.latestBlockhash();
        tx.feePayer = payer.publicKey;
        tx.sign(payer);
        let res = svm.sendTransaction(tx);

        const pdaAccount = svm.getAccount(pda);
        console.log("pda account lamports",pdaAccount?.lamports);
        console.log("pda account owner",pdaAccount?.owner.toBase58(),"===", payer.publicKey.toBase58());
    })
})

