use solana_program::{account_info::{AccountInfo, next_account_info}, entrypoint::ProgramResult, entrypoint, pubkey::Pubkey};
use borsh::{BorshDeserialize, BorshSerialize};

#[derive(BorshDeserialize, BorshSerialize)]
struct CounterState {
    count: u32
}

entrypoint!(process_instruction);

pub fn process_instruction(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    instructions: &[u8]
) -> ProgramResult {
    let mut accounts = accounts.iter();
    let data_account = next_account_info(&mut accounts)?;

    if !data_account.is_signer {
        return ProgramResult::Err(solana_program::program_error::ProgramError::MissingRequiredSignature);
    }

    let mut counter_state = CounterState::try_from_slice(&mut *data_account.data.borrow_mut())?;

    if counter_state.count == 0 {
        counter_state.count = counter_state.count + 1;
    }
    else{
        counter_state.count = counter_state.count * 2;
    }
    counter_state.serialize(&mut *data_account.data.borrow_mut())?;

    ProgramResult::Ok(())
}