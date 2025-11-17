import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Cal } from "../target/types/cal";
import { assert } from "chai";

describe("cal", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  let newAccount = anchor.web3.Keypair.generate();

  const program = anchor.workspace.cal as Program<Cal>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().accounts({
      signer: anchor.getProvider().wallet.publicKey,
      newAccount: newAccount.publicKey
    }).signers([newAccount]).rpc();
    console.log("Your transaction signature", tx);
  });


  it("Add!", async () => {
    // Add your test here.
    const tx = await program.methods.add(10).accounts({
      signer: anchor.getProvider().wallet.publicKey,
      account: newAccount.publicKey
    }).rpc();
    console.log("Your transaction signature", tx);
    let account = await program.account.newAccount.fetch(newAccount.publicKey);
    assert(account.data === 10)
  });

  it("sub!", async () => {
    // Add your test here.
    const tx = await program.methods.sub(5).accounts({
      signer: anchor.getProvider().wallet.publicKey,
      account: newAccount.publicKey
    }).rpc();
    console.log("Your transaction signature", tx);
    let account = await program.account.newAccount.fetch(newAccount.publicKey);
    assert(account.data === 5)
  });

  it("double!", async () => {
    // Add your test here.
    const tx = await program.methods.double().accounts({
      signer: anchor.getProvider().wallet.publicKey,
      account: newAccount.publicKey
    }).rpc();
    console.log("Your transaction signature", tx);
    let account = await program.account.newAccount.fetch(newAccount.publicKey);
    assert(account.data === 10)
  });

  it("halve!", async () => {
    const tx = await program.methods.halve().accounts({
      signer: anchor.getProvider().wallet.publicKey,
      account: newAccount.publicKey 
    }).rpc();
    console.log("Your transaction signature", tx);
    let account = await program.account.newAccount.fetch(newAccount.publicKey);
    assert(account.data === 5)
  })
});
