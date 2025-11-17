import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { ClassCal } from "../target/types/class_cal";
import { assert } from "chai";

describe("class-cal", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  let newAccount = anchor.web3.Keypair.generate();

  const program = anchor.workspace.classCal as Program<ClassCal>;
  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.init(10).accounts({
      signer: anchor.getProvider().wallet.publicKey,
      account: newAccount.publicKey
    }).signers([newAccount]).rpc();
    console.log("Your transaction signature", tx);
    let account = await program.account.dataShape.fetch(newAccount.publicKey);
    assert(account.num === 10)
  });

  it("Is Double!", async () => {
    // Add your test here.
    const tx = await program.methods.double().accounts({
      signer: anchor.getProvider().wallet.publicKey,
      account: newAccount.publicKey
    }).rpc();
    console.log("Your transaction signature", tx);
    let account = await program.account.dataShape.fetch(newAccount.publicKey);
    assert(account.num === 20)
  });


  it("Is Add!", async () => {
    // Add your test here.
    const tx = await program.methods.add(30).accounts({
      signer: anchor.getProvider().wallet.publicKey,
      account: newAccount.publicKey
    }).rpc();
    console.log("Your transaction signature", tx);
    let account = await program.account.dataShape.fetch(newAccount.publicKey);
    assert(account.num === 50)
  });
});
