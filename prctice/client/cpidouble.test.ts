import { Keypair, PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import {test, expect} from "bun:test";
import { LiteSVM } from "litesvm";

test("cpi to double contract", async () => {
    let svm = new LiteSVM();
    const doubleContract = PublicKey.unique();
    const cpiContract = PublicKey.unique();
    svm.addProgramFromFile(doubleContract, "./doubleee.so");
    svm.addProgramFromFile(cpiContract, "./cpiprodouble.so");

    let userAcc = new Keypair();
    let dataAcc = new Keypair();

    svm.airdrop(userAcc.publicKey, BigInt(1000_000_000));

    createDataAccountOnChain(svm, dataAcc, userAcc, doubleContract);

    function doubleIt() {
        const ix = new TransactionInstruction({
            keys: [
                {pubkey: dataAcc.publicKey, isWritable: true, isSigner: true},
                {pubkey: doubleContract, isWritable: false, isSigner: false}
            ],
            programId: cpiContract,
            data: Buffer.from([])
        })

        const blockhash = svm.latestBlockhash();
        let txn = new Transaction();
        txn.recentBlockhash = blockhash;
        txn.add(ix);
        txn.sign(userAcc, dataAcc);
        svm.sendTransaction(txn);
        svm.expireBlockhash();
    
    }

    doubleIt();
    doubleIt();
    doubleIt();
    doubleIt();
    doubleIt();
    doubleIt();


    const dataAccountData = svm.getAccount(dataAcc.publicKey);
    console.log("dataAccountData", dataAccountData?.data);
    
})

function createDataAccountOnChain(svm: LiteSVM, dataAcc: Keypair, userAcc: Keypair, doubleContract: PublicKey){
    let blockhash = svm.latestBlockhash();
    const ix = [
        SystemProgram.createAccount({
            fromPubkey: userAcc.publicKey,
            newAccountPubkey: dataAcc.publicKey,
            lamports: Number(svm.minimumBalanceForRentExemption(BigInt(4))),
            space: 4,
            programId: doubleContract
        })
    ]

    const tx = new Transaction();
    tx.recentBlockhash = blockhash;
    tx.add(...ix);
    tx.sign(userAcc, dataAcc);
    svm.sendTransaction(tx);
}