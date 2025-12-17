use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{account_info::{AccountInfo, next_account_info}, entrypoint, entrypoint::ProgramResult, msg, 
program::invoke, program_error::ProgramError, pubkey::Pubkey, rent::Rent, system_instruction, sysvar::Sysvar};

#[derive(BorshDeserialize, BorshSerialize)]
struct Counter {
    count: u32
}

#[derive(BorshDeserialize, BorshSerialize)]
enum InstrucionData {
    Initialize,
    Double,
    Half
}

entrypoint!(process_instruction);

fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction: &[u8]
) -> ProgramResult {
    let instruction = InstrucionData::try_from_slice(instruction)
    .map_err(|_| ProgramError::InvalidInstructionData)?;

    match instruction {
        InstrucionData::Initialize => {
            msg!("Initilaize account");
            let iter = &mut accounts.iter();
            let user_account = next_account_info(iter)?;
            let data_account = next_account_info(iter)?;
            let system = next_account_info(iter)?;

            if !user_account.is_signer {
                return Err(ProgramError::MissingRequiredSignature);
            }

            let space = 4;

            let rent = Rent::get()?;
            let lamport = rent.minimum_balance(space);

            let create_account = system_instruction::create_account(
                user_account.key, 
                data_account.key,
                lamport, 
                space as u64, 
                program_id
            );

            invoke(&create_account, &[
                user_account.clone(),
                data_account.clone(),
                system.clone()
            ])?;

            let counter_state = Counter {count: 1};
            counter_state.serialize(&mut *data_account.data.borrow_mut())?;
        }

        InstrucionData::Double => {
            msg!("double value");

            let iter = &mut accounts.iter();
            let data_account = next_account_info(iter)?;    
            let user_account = next_account_info(iter)?;

            if data_account.owner != program_id {
                return Err(ProgramError::IncorrectProgramId);
            }

            if !user_account.is_signer {
                return Err(ProgramError::MissingRequiredSignature);
            }

            let mut counter_state = Counter::try_from_slice(&mut data_account.data.borrow())?;
            counter_state.count *= 2;

            counter_state.serialize(&mut *data_account.data.borrow_mut())?;
        }

        InstrucionData::Half => {
            msg!("half value");

            let iter = &mut accounts.iter();
            let data_account = next_account_info(iter)?;    
            let user_account = next_account_info(iter)?;

            if data_account.owner != program_id {
                return Err(ProgramError::IncorrectProgramId);
            }

            if !user_account.is_signer {
                return Err(ProgramError::MissingRequiredSignature);
            }

            let mut counter_state = Counter::try_from_slice(&mut data_account.data.borrow())?;

            if counter_state.count <= 1 {
                return Err(ProgramError::InvalidInstructionData);
            }
            counter_state.count /= 2;
            
            counter_state.serialize(&mut *data_account.data.borrow_mut())?;
        }
    }

    Ok(())
}