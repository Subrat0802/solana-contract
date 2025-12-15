import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AncorCal } from "../target/types/ancor_cal";

describe("ancor-cal", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.ancorCal as Program<AncorCal>;
  const newAccount = anchor.web3.Keypair.generate();

  it("Is initialized!", async () => {
    const tx = await program.methods.initialize(10)
    .accounts({
      newAccount: newAccount.publicKey,
      signer: anchor.getProvider().wallet.publicKey,
    })
    .signers([newAccount])
    .rpc();
    console.log("Your transaction signature", tx);
  });

  it("add", async () => {
    const tx = await program.methods.add(10)
    .accounts({
      newAccount: newAccount.publicKey,
      signer: anchor.getProvider().wallet.publicKey,
    })
    .rpc();
    console.log("add transaction", tx);
  })
  it("sub", async () => {
    const tx = await program.methods.sub(10)
    .accounts({
      newAccount: newAccount.publicKey,
      signer: anchor.getProvider().wallet.publicKey,
    })
    .rpc();
    console.log("sub transaction", tx);
  })
  it("mul", async () => {
    const tx = await program.methods.mul(10)
    .accounts({
      newAccount: newAccount.publicKey,
      signer: anchor.getProvider().wallet.publicKey,
    })
    .rpc();
    console.log("mul transaction", tx);
  })
  it("div", async () => {
    const tx = await program.methods.div(2)
    .accounts({
      newAccount: newAccount.publicKey,
      signer: anchor.getProvider().wallet.publicKey,
    })
    .rpc();
    console.log("div transaction", tx);
  })
});
