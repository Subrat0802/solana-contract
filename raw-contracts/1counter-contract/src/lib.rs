use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{account_info::{AccountInfo, next_account_info}, entrypoint, entrypoint::ProgramResult, pubkey::Pubkey};

entrypoint!(process_instruction);

#[derive(BorshDeserialize, BorshSerialize)]
struct Counter {
    count: u32
}

#[derive(BorshSerialize, BorshDeserialize)]
enum Instructions {
    Add(u32),
    Dec(u32)
}

fn process_instruction(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    instructions: &[u8]
) -> ProgramResult {
    let iter = &mut accounts.iter();
    let data_account = next_account_info(iter)?;
    let mut counter = Counter::try_from_slice(&data_account.data.borrow())?;

    match Instructions::try_from_slice(instructions)? {
        Instructions::Add(amount) => {
            counter.count += amount;
        }
        Instructions::Dec(amount) => {
            counter.count -= amount;
        }
    }

    counter.serialize(&mut *data_account.data.borrow_mut())?;

    Ok(())
}