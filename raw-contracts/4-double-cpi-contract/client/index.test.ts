import { Keypair, PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import {test, expect} from "bun:test";
import { LiteSVM } from "litesvm";

const doubleCont = PublicKey.unique();
const cpiDoubleCont = PublicKey.unique();
const svm = new LiteSVM();
svm.addProgramFromFile(doubleCont, "./doubledecnew.so");
svm.addProgramFromFile(cpiDoubleCont, "./doublecpidecnew.so");

const userAcc = new Keypair();
const dataAcc = new Keypair();

svm.airdrop(userAcc.publicKey, BigInt(1000000000));

createDataAccountOnChain(svm, userAcc, dataAcc, doubleCont);

const bal = svm.getBalance(dataAcc.publicKey);
console.log(bal);


test("call cpi contract and and double the value", () => {

    function doubleIt() {
        const tx = new Transaction();
        tx.add(new TransactionInstruction({
            keys:[
                {pubkey: userAcc.publicKey, isSigner:true, isWritable: false},
                {pubkey: dataAcc.publicKey, isSigner:false, isWritable: true},
                {pubkey: doubleCont, isSigner: false, isWritable: false}
            ],
            programId: cpiDoubleCont,
            data: Buffer.from("")
        }));

        tx.recentBlockhash = svm.latestBlockhash();
        tx.sign(userAcc);
        svm.sendTransaction(tx);
        svm.expireBlockhash();
    }

    doubleIt();
    doubleIt();
    doubleIt();
    doubleIt();
    doubleIt();
    doubleIt();

    const dataAccountInfo = svm.getAccount(dataAcc.publicKey);
    console.log(dataAccountInfo?.data);
})

function createDataAccountOnChain(svm:LiteSVM, userAcc: Keypair, dataAcc: Keypair, doubleCont: PublicKey){
    const tx = new Transaction();
    tx.add(SystemProgram.createAccount({
        fromPubkey: userAcc.publicKey,
        newAccountPubkey:dataAcc.publicKey,
        lamports: Number(svm.minimumBalanceForRentExemption(BigInt(4))),
        space: 4,
        programId: doubleCont
    }));

    tx.recentBlockhash = svm.latestBlockhash();
    tx.sign(userAcc, dataAcc)
    svm.sendTransaction(tx);

}