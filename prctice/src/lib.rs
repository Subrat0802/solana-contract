use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{account_info::{AccountInfo, next_account_info}, entrypoint ,entrypoint::ProgramResult, pubkey::Pubkey};


entrypoint!(process_instruction);

#[derive(BorshDeserialize, BorshSerialize)]
struct Counter {
    count: u32
}

#[derive(BorshDeserialize, BorshSerialize)]
enum Instructions {
    Increment(u32),
    Decrement(u32)
}

pub fn process_instruction(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    instructions: &[u8]
) -> ProgramResult {
    let accs = &mut accounts.iter();
    let data_acc = next_account_info(accs)?;

    let mut counter = Counter::try_from_slice(&mut data_acc.data.borrow_mut())?;

    match Instructions::try_from_slice(instructions)? {
        Instructions::Increment(amount) => {
            counter.count += amount;
        }
        Instructions::Decrement(amount) => {
            counter.count -= amount;
        }
    }
    counter.serialize(&mut *data_acc.data.borrow_mut())?;
    Ok(())
}