use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{account_info::{AccountInfo, next_account_info}, entrypoint::ProgramResult, entrypoint, msg, program_error::ProgramError, pubkey::Pubkey};

entrypoint!(process_instruction);


#[derive(BorshDeserialize, BorshSerialize)]
struct Counter {
    count: u32
}

#[derive(BorshDeserialize, BorshSerialize)]
enum Instructions {
    Init,
    Double,
    Half
}
fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let iter = &mut accounts.iter();
    let data_account = next_account_info(iter)?;
    let user_account = next_account_info(iter)?;

    if !user_account.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }

    if data_account.owner != program_id {
        return Err(ProgramError::IncorrectProgramId);
    }

    if !data_account.is_writable {
        return Err(ProgramError::InvalidAccountData);
    }

    match Instructions::try_from_slice(instruction_data)? {
        Instructions::Init => {
            let mut counter = Counter::try_from_slice(&data_account.data.borrow())?;

            if counter.count != 0 {
                return Err(ProgramError::AccountAlreadyInitialized);
            }

            counter.count = 1;
            counter.serialize(&mut *data_account.data.borrow_mut())?;
            msg!("Counter initialized to 1");
        }

        Instructions::Double => {
            let mut counter = Counter::try_from_slice(&data_account.data.borrow())?;

            counter.count = counter
                .count
                .checked_mul(2)
                .ok_or(ProgramError::InvalidInstructionData)?;

            counter.serialize(&mut *data_account.data.borrow_mut())?;
            msg!("Counter doubled");
        }

        Instructions::Half => {
            let mut counter = Counter::try_from_slice(&data_account.data.borrow())?;

            if counter.count <= 1 {
                return Err(ProgramError::InvalidInstructionData);
            }

            counter.count /= 2;
            counter.serialize(&mut *data_account.data.borrow_mut())?;
            msg!("Counter halved");
        }
    }

    Ok(())
}
