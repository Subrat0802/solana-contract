import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Calculator } from "../target/types/calculator";
import assert from "assert";

describe("anchor-calculator", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.calculator as Program<Calculator>;
  const newAccount = anchor.web3.Keypair.generate();

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.init(10)
      .accounts({
        account: newAccount.publicKey,
        signer: anchor.getProvider().wallet.publicKey,
      })
      .signers([newAccount])
      .rpc();
    console.log("Your transaction signature", tx);
    const account = await program.account.dataShape.fetch(newAccount.publicKey);
    assert(account.num == 10);
  });

  it("Is double!", async () => {
    const tx = await program.methods.double()
      .accounts({
        account: newAccount.publicKey,
        signer: anchor.getProvider().wallet.publicKey,
      })
      .rpc();
    console.log("Your transaction signature", tx);
    const account = await program.account.dataShape.fetch(newAccount.publicKey);
    assert.equal(account.num, 20);
  });

  it("Is add!", async () => {
    const tx = await program.methods.add(2)
      .accounts({
        account: newAccount.publicKey,
      })
      .rpc();
    console.log("Your transaction signature", tx);
    const account = await program.account.dataShape.fetch(newAccount.publicKey);
    assert.equal(account.num, 22);
  });
});
