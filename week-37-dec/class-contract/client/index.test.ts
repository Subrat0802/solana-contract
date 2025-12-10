import { Keypair, PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import {test, expect, describe, beforeAll } from "bun:test";
import { LiteSVM } from "litesvm";

describe("Create pda from client", () => {
    let litesvm: LiteSVM;
    let pda: PublicKey;
    let bump: number;
    let programId:PublicKey;
    let payer: Keypair;
    
    beforeAll(() => {
        litesvm = new LiteSVM();
        programId = PublicKey.unique();
        payer = new Keypair();
        litesvm.addProgramFromFile(programId, "./createpdadec.so");
        litesvm.airdrop(payer.publicKey, BigInt(1000000000));

        [pda, bump] = PublicKey.findProgramAddressSync(
            [payer.publicKey.toBuffer(), Buffer.from("user")], 
            programId
        );


        console.log("PDA AND BUMP", pda.toBase58(), bump);

        let ix = new TransactionInstruction({
            keys: [
                {
                    pubkey: pda,
                    isSigner:false,
                    isWritable: true
                },
                {
                    pubkey: payer.publicKey,
                    isSigner:true,
                    isWritable:true
                },
                {
                    pubkey: SystemProgram.programId,
                    isSigner: false,
                    isWritable: false
                }
            ],
            programId,
            data: Buffer.from("")
        })

        const tx = new Transaction().add(ix);
        tx.feePayer = payer.publicKey;
        tx.recentBlockhash = litesvm.latestBlockhash();
        tx.sign(payer);
        let res = litesvm.sendTransaction(tx);
        
        console.log("RESPONSE",res.toString());
        const bal = litesvm.getBalance(pda);
        console.log("PDA BALANCE", bal);
    });

    test("should create pda", () => {
        const balance = litesvm.getBalance(pda);
        console.log(balance)
        expect(Number(balance)).toBeGreaterThan(0);
    });
})