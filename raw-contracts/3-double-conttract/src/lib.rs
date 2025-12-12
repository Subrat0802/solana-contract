use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{account_info::{AccountInfo, next_account_info}, entrypoint, entrypoint::ProgramResult, pubkey::Pubkey,
program_error::ProgramError
};

entrypoint!(process_instructions);

#[derive(BorshDeserialize, BorshSerialize)]
struct Counter {
    count: u32
}


fn process_instructions(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction: &[u8]
) -> ProgramResult{
    let iter = &mut accounts.iter();
    let user_account = next_account_info(iter)?;
    let data_account = next_account_info(iter)?;

    if !user_account.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }

    if data_account.owner != program_id {
        return Err(ProgramError::IncorrectProgramId);
    }

    if !data_account.is_writable {
        return Err(ProgramError::InvalidAccountData);
    }

    let mut counter = Counter::try_from_slice(&data_account.data.borrow())
    .unwrap_or(Counter { count: 0 });

    if counter.count == 0 {
        counter.count = 1;
    }
    else{
        counter.count *= 2;
    }

    counter.serialize(&mut *data_account.data.borrow_mut())?;

    Ok(())
}