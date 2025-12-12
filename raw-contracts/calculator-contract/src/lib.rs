use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{account_info::{AccountInfo, next_account_info}, entrypoint::ProgramResult, entrypoint, pubkey::Pubkey,
program_error::ProgramError
};

entrypoint!(process_instruction);

#[derive(BorshDeserialize, BorshSerialize)]
struct Counter {
    count: u32
}

#[derive(BorshDeserialize, BorshSerialize)]
enum Instructions {
    Init(),
    Add(u32),
    Sub(u32),
    Mul(u32),
    Div(u32),
}

fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction: &[u8]
) -> ProgramResult {

    if instruction.is_empty(){
        return Err(ProgramError::InvalidInstructionData);
    }
    
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

    let mut counter = Counter::try_from_slice(&data_account.data.borrow())?;

    match Instructions::try_from_slice(instruction)? {
        Instructions::Init() => {
            counter.count = 0;
        }
        Instructions::Add(amount) => {
            counter.count = counter.count.saturating_add(amount);
        }
        Instructions::Sub(amount) => {
            if counter.count < amount{
                return Err(ProgramError::InvalidArgument);
            }
            counter.count = counter.count.saturating_sub(amount);
        }
        Instructions::Mul(amount) => {
            counter.count = counter.count.saturating_mul(amount);
        }
        Instructions::Div(amount) => {
            if amount == 0{
                return Err(ProgramError::InvalidArgument);
            }
            counter.count = counter.count.saturating_div(amount)
        }
    }

    counter.serialize(&mut *data_account.data.borrow_mut())?;

    Ok(())
}