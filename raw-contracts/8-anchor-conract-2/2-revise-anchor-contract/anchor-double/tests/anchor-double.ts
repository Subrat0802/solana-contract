import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorDouble } from "../target/types/anchor_double";

describe("anchor-double", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const dataAccount = anchor.web3.Keypair.generate();
  const program = anchor.workspace.anchorDouble as Program<AnchorDouble>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize()
    .accounts({
      dataAccount: dataAccount.publicKey,
      user: anchor.getProvider().wallet.publicKey
    })
    .signers([dataAccount])
    .rpc();
    const account = await program.account.dataAccount.fetch(dataAccount.publicKey);
    console.log("acount", account);
    console.log("Your transaction signature", tx);
  });

  it("Is double!", async () => {
    // Add your test here.
    const tx = await program.methods.double()
    .accounts({
      dataAccount: dataAccount.publicKey,
    })
    .rpc();
    const account = await program.account.dataAccount.fetch(dataAccount.publicKey);
    console.log("acount", account);
    console.log("Your transaction signature", tx);
  });

  it("Is double!", async () => {
    // Add your test here.
    const tx = await program.methods.double()
    .accounts({
      dataAccount: dataAccount.publicKey,
    })
    .rpc();
    const account = await program.account.dataAccount.fetch(dataAccount.publicKey);
    console.log("acount", account);
    console.log("Your transaction signature", tx);
  });

  it("Is half!", async () => {
    // Add your test here.
    const tx = await program.methods.half()
    .accounts({
      dataAccount: dataAccount.publicKey,
    })
    .rpc();
    const account = await program.account.dataAccount.fetch(dataAccount.publicKey);
    console.log("acount", account);
    console.log("Your transaction signature", tx);
  });
});
