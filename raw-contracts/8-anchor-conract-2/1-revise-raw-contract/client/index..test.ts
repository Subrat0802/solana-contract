import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { beforeAll, describe, test } from "bun:test";
import { CounterProgram, GREETING_SIZE, schema } from "./instruction";
import * as borsh from "borsh";

const userAcc = new Keypair();
const dataAcc = new Keypair();
const connection = new Connection("http://127.0.0.1:8899", "confirmed");
const programId = new PublicKey("DXsqq1iaLGRAmDko9tRhJuvnVoEVUjKNcUhnncBm4JMM");

beforeAll(async () => {
  const respo = await connection.requestAirdrop(userAcc.publicKey, 1000000000);
  await connection.confirmTransaction(respo);

  const lamport = await connection.getMinimumBalanceForRentExemption(
    GREETING_SIZE
  );

  const tx = new Transaction();
  tx.add(
    SystemProgram.createAccount({
      fromPubkey: userAcc.publicKey,
      newAccountPubkey: dataAcc.publicKey,
      lamports: lamport,
      space: GREETING_SIZE,
      programId: programId,
    })
  );

  const txhash = await connection.sendTransaction(tx, [userAcc, dataAcc]);
  await connection.confirmTransaction(txhash);

  const dataAccInfo = await connection.getAccountInfo(dataAcc.publicKey);
  if (!dataAccInfo?.data) {
    throw new Error("Data account not found");
  }

  const data = borsh.deserialize(schema, dataAccInfo.data) as CounterProgram;
  console.log(data.count);
});

test("init account", async () => {
  const tx = new Transaction();
  tx.add(
    new TransactionInstruction({
      keys: [
        { pubkey: dataAcc.publicKey, isWritable: true, isSigner: false },
        { pubkey: userAcc.publicKey, isWritable: false, isSigner: true },
      ],
      programId: programId,
      data: Buffer.from(new Uint8Array([0])),
    })
  );

  const txhash = await connection.sendTransaction(tx, [userAcc]);
  await connection.confirmTransaction(txhash);

  const dataAccInfo = await connection.getAccountInfo(dataAcc.publicKey);
  if (!dataAccInfo?.data) {
    throw new Error("Data account not found");
  }

  const data = borsh.deserialize(schema, dataAccInfo.data) as CounterProgram;
  console.log(data.count);
});

test("double", async () => {
    const tx = new Transaction();
    tx.add(
    new TransactionInstruction({
      keys: [
        { pubkey: dataAcc.publicKey, isWritable: true, isSigner: false },
        { pubkey: userAcc.publicKey, isWritable: false, isSigner: true },
      ],
      programId: programId,
      data: Buffer.from(new Uint8Array([1])),
    })
  );

  const txhash = await connection.sendTransaction(tx, [userAcc]);
  await connection.confirmTransaction(txhash);

  const dataAccInfo = await connection.getAccountInfo(dataAcc.publicKey);
  if (!dataAccInfo?.data) {
    throw new Error("Data account not found");
  }

  const data = borsh.deserialize(schema, dataAccInfo.data) as CounterProgram;
  console.log(data.count);

})


test("double", async () => {
    const tx = new Transaction();
    tx.add(
    new TransactionInstruction({
      keys: [
        { pubkey: dataAcc.publicKey, isWritable: true, isSigner: false },
        { pubkey: userAcc.publicKey, isWritable: false, isSigner: true },
      ],
      programId: programId,
      data: Buffer.from(new Uint8Array([1])),
    })
  );

  const txhash = await connection.sendTransaction(tx, [userAcc]);
  await connection.confirmTransaction(txhash);

  const dataAccInfo = await connection.getAccountInfo(dataAcc.publicKey);
  if (!dataAccInfo?.data) {
    throw new Error("Data account not found");
  }

  const data = borsh.deserialize(schema, dataAccInfo.data) as CounterProgram;
  console.log(data.count);

})

test("double", async () => {
    const tx = new Transaction();
    tx.add(
    new TransactionInstruction({
      keys: [
        { pubkey: dataAcc.publicKey, isWritable: true, isSigner: false },
        { pubkey: userAcc.publicKey, isWritable: false, isSigner: true },
      ],
      programId: programId,
      data: Buffer.from(new Uint8Array([1])),
    })
  );

  const txhash = await connection.sendTransaction(tx, [userAcc]);
  await connection.confirmTransaction(txhash);

  const dataAccInfo = await connection.getAccountInfo(dataAcc.publicKey);
  if (!dataAccInfo?.data) {
    throw new Error("Data account not found");
  }

  const data = borsh.deserialize(schema, dataAccInfo.data) as CounterProgram;
  console.log(data.count);

})


test("double", async () => {
    const tx = new Transaction();
    tx.add(
    new TransactionInstruction({
      keys: [
        { pubkey: dataAcc.publicKey, isWritable: true, isSigner: false },
        { pubkey: userAcc.publicKey, isWritable: false, isSigner: true },
      ],
      programId: programId,
      data: Buffer.from(new Uint8Array([2])),
    })
  );

  const txhash = await connection.sendTransaction(tx, [userAcc]);
  await connection.confirmTransaction(txhash);

  const dataAccInfo = await connection.getAccountInfo(dataAcc.publicKey);
  if (!dataAccInfo?.data) {
    throw new Error("Data account not found");
  }

  const data = borsh.deserialize(schema, dataAccInfo.data) as CounterProgram;
  console.log(data.count);

})
