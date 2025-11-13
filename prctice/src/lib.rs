use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{account_info::{AccountInfo, next_account_info}, entrypoint::ProgramResult, entrypoint, pubkey::Pubkey};


entrypoint!(process_instruction);

#[derive(BorshDeserialize, BorshSerialize)]
struct Favourite {
    name: String,
    color: String,
    number: u32
}

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instructions: &[u8]
) -> ProgramResult {
    let accs = &mut accounts.iter();
    let data_acc = next_account_info(accs)?;

    let mut data = data_acc.data.borrow_mut();

    // Initialize on first write (account full of zeros)
    let mut favourites = if data.iter().all(|&b| b == 0) {
        Favourite {
            name: "".to_string(),
            color: "".to_string(),
            number: 0,
        }
    } else {
        Favourite::try_from_slice(&data)?
    };

    // Deserialize incoming favourite update
    let new_fav = Favourite::try_from_slice(instructions)?;

    favourites.name = new_fav.name;
    favourites.color = new_fav.color;
    favourites.number = new_fav.number;

    // Serialize back
    favourites.serialize(&mut &mut data[..])?;

    Ok(())
}











// double contract ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// use borsh::{BorshDeserialize, BorshSerialize};
// use solana_program::{account_info::{AccountInfo, next_account_info},entrypoint, entrypoint::ProgramResult, pubkey::Pubkey};


// entrypoint!(process_instruction);

// #[derive(BorshDeserialize, BorshSerialize)]
// pub struct CounterState {
//     count: u32
// }


// pub fn process_instruction(
//     program_id: &Pubkey,
//     accounts: &[AccountInfo],
//     instructions: &[u8]
// ) -> ProgramResult {
//     let accs: &mut std::slice::Iter<'_, AccountInfo<'_>> = &mut accounts.iter();
//     let data_acc = next_account_info(accs)?;

//     if !data_acc.is_signer {
//         return ProgramResult::Err(solana_program::program_error::ProgramError::MissingRequiredSignature)
//     }

//     let mut counter = CounterState::try_from_slice(&mut data_acc.data.borrow_mut())?;

//     if counter.count == 0 {
//         counter.count = 1;
//     } else{
//         counter.count *= 2
//     }

//     counter.serialize(&mut *data_acc.data.borrow_mut())?;

//     ProgramResult::Ok(())
// }









//counter program++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


// use borsh::{BorshDeserialize, BorshSerialize};
// use solana_program::{account_info::{AccountInfo, next_account_info}, entrypoint ,entrypoint::ProgramResult, pubkey::Pubkey};


// entrypoint!(process_instruction);

// #[derive(BorshDeserialize, BorshSerialize)]
// struct Counter {
//     count: u32
// }

// #[derive(BorshDeserialize, BorshSerialize)]
// enum Instructions {
//     Increment(u32),
//     Decrement(u32)
// }

// pub fn process_instruction(
//     _program_id: &Pubkey,
//     accounts: &[AccountInfo],
//     instructions: &[u8]
// ) -> ProgramResult {
//     let accs = &mut accounts.iter();
//     let data_acc = next_account_info(accs)?;

//     let mut counter = Counter::try_from_slice(&mut data_acc.data.borrow_mut())?;

//     match Instructions::try_from_slice(instructions)? {
//         Instructions::Increment(amount) => {
//             counter.count += amount;
//         }
//         Instructions::Decrement(amount) => {
//             counter.count -= amount;
//         }
//     }
//     counter.serialize(&mut *data_acc.data.borrow_mut())?;
//     Ok(())
// }