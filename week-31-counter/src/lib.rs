use solana_program::{
    account_info::{AccountInfo, next_account_info}, entrypoint::ProgramResult, entrypoint, msg, pubkey::Pubkey
};
use borsh::{BorshDeserialize, BorshSerialize};

entrypoint!(process_instruction);

#[derive(BorshDeserialize, BorshSerialize)]
struct Counter {
    count: u32
}

#[derive(BorshDeserialize, BorshSerialize)]
enum Instructions {
    Add(u32),
    Dec(u32)
}

pub fn process_instruction(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8]
) -> ProgramResult {

    let accounts = &mut accounts.iter();
    let data_account = next_account_info(accounts)?;

    let mut counter = Counter::try_from_slice(&data_account.data.borrow())?;

    match Instructions::try_from_slice(instruction_data)? {
        Instructions::Add(amount) => {
            counter.count += amount;
            msg!("Increament Counter by {}", amount);
        }
        Instructions::Dec(amount) => {
            counter.count -= amount;
            msg!("Decreament Counter by {}", amount);
        }
    }

    counter.serialize(&mut *data_account.data.borrow_mut())?;

    msg!("Counter updated successfully {}", counter.count);

    Ok(())
}