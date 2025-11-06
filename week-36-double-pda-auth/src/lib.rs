use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program::{invoke_signed},
    program_error::ProgramError,
    pubkey::Pubkey,
    system_instruction,
    sysvar::{rent::Rent, Sysvar},
};

/// The data stored inside the PDA.
/// count is stored as a simple u32.
#[derive(BorshDeserialize, BorshSerialize)]
struct CounterState {
    count: u32,
}

/// The two instructions this program supports:
/// - Init(bump): create PDA and initialize count to 0
/// - Update(bump): read count and update it on-chain
#[derive(BorshDeserialize, BorshSerialize)]
enum Ix {
    Init { bump: u8 },
    Update { bump: u8 },
}

/// Seed prefix used for PDA creation.
/// PDA = hash("counter" + authority + bump)
const SEED_PREFIX: &[u8] = b"counter";

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,     // ID of the deployed program
    accounts: &[AccountInfo], // accounts passed in from client
    ix_data: &[u8],           // serialized instruction data from client
) -> ProgramResult {
    // Parse incoming accounts in expected order
    let mut accs = accounts.iter();
    let authority = next_account_info(&mut accs)?; // payer & signer wallet
    let data_pda  = next_account_info(&mut accs)?; // PDA storing CounterState
    let system    = next_account_info(&mut accs)?; // System Program (used for create_account)

    // Authority must sign the transaction
    if !authority.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }

    // Decode instruction into enum (Init or Update)
    let ix = Ix::try_from_slice(ix_data)?;

    match ix {
        // -----------------------------------------
        // INIT: Create PDA + Write initial state
        // -----------------------------------------
        Ix::Init { bump } => {
            // Ensure the PDA passed in is the correct derived PDA
            let expected_pda = Pubkey::create_program_address(
                &[SEED_PREFIX, authority.key.as_ref(), &[bump]],
                program_id,
            ).map_err(|_| ProgramError::InvalidSeeds)?;

            if expected_pda != *data_pda.key {
                return Err(ProgramError::InvalidSeeds);
            }

            // If account is not already created for this program, create it.
            if data_pda.data_len() == 0 || *data_pda.owner != *program_id {
                let rent = Rent::get()?;
                let space = 4; // space needed to hold u32
                let lamports = rent.minimum_balance(space);

                // Build a system instruction to create the PDA account
                let create_ix = system_instruction::create_account(
                    authority.key, // payer
                    data_pda.key,  // new PDA address
                    lamports,
                    space as u64,
                    program_id,
                );

                // PDA signing seeds (needed for invoke_signed)
                let seeds: &[&[u8]] = &[SEED_PREFIX, authority.key.as_ref(), &[bump]];

                // Actually create PDA account on-chain
                invoke_signed(
                    &create_ix,
                    &[authority.clone(), data_pda.clone(), system.clone()],
                    &[seeds], // Program signs using seeds
                )?;

                // Write initial value: count = 0
                let state = CounterState { count: 0 };
                state.serialize(&mut *data_pda.data.borrow_mut())?;
            }

            msg!("Initialized counter PDA {}", data_pda.key);
        }

        // -----------------------------------------
        // UPDATE: Load counter, update it, and store
        // -----------------------------------------
        Ix::Update { bump } => {
            // Verify PDA again for security
            let expected_pda = Pubkey::create_program_address(
                &[SEED_PREFIX, authority.key.as_ref(), &[bump]],
                program_id,
            ).map_err(|_| ProgramError::InvalidSeeds)?;

            if expected_pda != *data_pda.key {
                return Err(ProgramError::InvalidSeeds);
            }

            // Ensure this PDA is owned by this program
            if data_pda.owner != program_id {
                return Err(ProgramError::IncorrectProgramId);
            }

            // Must be writable
            if !data_pda.is_writable {
                return Err(ProgramError::InvalidAccountData);
            }

            // Deserialize the counter state
            let mut state = CounterState::try_from_slice(&data_pda.data.borrow())?;

            // Update logic:
            // If 0 → set to 1
            // Otherwise multiply by 2
            state.count = if state.count == 0 {
                state.count + 1
            } else {
                state.count * 2
            };

            // Write updated state back to PDA account
            state.serialize(&mut *data_pda.data.borrow_mut())?;

            msg!("Counter updated to {}", state.count);
        }
    }

    Ok(())
}
