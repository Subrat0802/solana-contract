use solana_program::{account_info::{AccountInfo, next_account_info}, entrypoint::ProgramResult, entrypoint, instruction::{AccountMeta, Instruction}, program::invoke, pubkey::Pubkey};

entrypoint!(process_instruction);


fn process_instruction(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    _instructions: &[u8]
) -> ProgramResult {
    let accounts = &mut accounts.iter();
    let data_account = next_account_info(accounts)?;
    let program_account = next_account_info(accounts)?;

    let instruction = Instruction{
        program_id: *program_account.key,
        accounts: vec![AccountMeta{
            is_signer: false,
            is_writable: true,
            pubkey: *data_account.key
        }],
        data: vec![]
    };

    invoke(&instruction, &[data_account.clone()])?;

    Ok(())
}








//+++++++++++++++++++++++++++++++++
// use borsh::{BorshDeserialize, BorshSerialize};
// use solana_program::{account_info::{AccountInfo, next_account_info}, entrypoint::ProgramResult, entrypoint, pubkey::Pubkey};

// entrypoint!(processs_instructions);
// #[derive(BorshDeserialize, BorshSerialize)]
// struct Counter {
//     count: u32
// }

// fn processs_instructions(
//     programid: &Pubkey,
//     accounts: &[AccountInfo],
//     instructions: &[u8]
// ) -> ProgramResult {
//     let accounts = &mut accounts.iter();
//     let data_account = next_account_info(accounts)?;

//     let mut counter = Counter::try_from_slice(&mut data_account.data.borrow_mut())?;

//     if counter.count == 0 {
//         counter.count = 1
//     }else{
//         counter.count *= 2
//     }

//     counter.serialize(&mut *data_account.data.borrow_mut())?;

//     Ok(())
// }











// double +++++++++++++++++++++++++++++++++++++++++++++++++++
// use borsh::{BorshDeserialize, BorshSerialize};
// use solana_program::{account_info::{AccountInfo, next_account_info}, entrypoint::ProgramResult, entrypoint, pubkey::Pubkey};

// #[derive(BorshSerialize, BorshDeserialize)]
// struct Counter {
//     count: u32
// }

// #[derive(BorshDeserialize, BorshSerialize)]
// enum Instructions {
//     Incre(u32),
//     Decre(u32)
// }

// entrypoint!(program_instruction);

// fn program_instruction(
//     programid: &Pubkey,
//     accounts: &[AccountInfo],
//     instruction: &[u8]
// ) -> ProgramResult{

//     let iter = &mut accounts.iter();
//     let data_account = next_account_info(iter)?;

//     let mut  counter = Counter::try_from_slice(&mut data_account.data.borrow_mut())?;

//     match Instructions::try_from_slice(instruction)? {
//         Instructions::Incre(amount) => {
//             counter.count += amount;
//         }
//         Instructions::Decre(amount) => {
//             counter.count -= amount;
//         }
//     }
//     counter.serialize(&mut *data_account.data.borrow_mut())?;
//     Ok(())
// }













//cal+++++++++++++++++++++++++++++++++++++++++

// use borsh::{BorshDeserialize, BorshSerialize};
// use solana_program::{account_info::{AccountInfo, next_account_info}, entrypoint::ProgramResult, entrypoint, msg, program_error::ProgramError, pubkey::Pubkey};


// entrypoint!(process_instructions);

// #[derive(BorshDeserialize, BorshSerialize)]
// struct Counter {
//     count: u32
// }

// #[derive(BorshDeserialize, BorshSerialize)]
// enum Instructions {
//     Add(u32),
//     Sub(u32),
//     Mul(u32),
//     Div(u32),
// } 

// pub fn process_instructions(
//     program_id: &Pubkey,
//     accounts: &[AccountInfo],
//     instructions: &[u8]
// ) -> ProgramResult {
//     let mut accs = accounts.iter();
//     let data_acc = next_account_info(&mut accs)?;

//     // SAFETY CHECK — important!
//     if data_acc.owner != program_id {
//         msg!("Account not owned by the program");
//         return Err(ProgramError::IncorrectProgramId);
//     }


//     let mut data_acc_data = Counter::try_from_slice(&data_acc.data.borrow())?;

//     if data_acc_data.count == 0 {
//         data_acc_data.count = 1;
//     }
//     else {
//         match Instructions::try_from_slice(instructions)? {
//             Instructions::Add(amount) => {
//                 data_acc_data.count += amount;
//             }   
//             Instructions::Sub(amount) => {
//             // Prevent underflow
//             if data_acc_data.count < amount {
//                 msg!("Cannot subtract more than current count");
//                 return Err(ProgramError::InvalidArgument);
//             }

//             // Prevent result < 2
//             if data_acc_data.count - amount < 2 {
//                 msg!("count cannot go below 2");
//                 return Err(ProgramError::InvalidArgument);
//             }

//             data_acc_data.count -= amount;
//         }  
//             Instructions::Mul(amount) => {
//                 data_acc_data.count *= amount;
//             }   
//             Instructions::Div(amount) => {
//             if amount == 0 {
//                 msg!("Cannot divide by zero");
//                 return Err(ProgramError::InvalidArgument);
//             }

//             let result = data_acc_data.count / amount;

//             if result < 2 {
//                 msg!("Result cannot go below 2");
//                 return Err(ProgramError::InvalidArgument);
//             }

//             data_acc_data.count = result;
//         }
     
//         }
//     }

//     data_acc_data.serialize(&mut *data_acc.data.borrow_mut())?;
//     Ok(())
// }














//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// // favourite contract
// use borsh::{BorshDeserialize, BorshSerialize};
// use solana_program::{account_info::{AccountInfo, next_account_info}, entrypoint::ProgramResult, entrypoint, pubkey::Pubkey};


// entrypoint!(process_instruction);

// #[derive(BorshDeserialize, BorshSerialize)]
// struct Favourite {
//     name: String,
//     color: String,
//     number: u32
// }

// pub fn process_instruction(
//     program_id: &Pubkey,
//     accounts: &[AccountInfo],
//     instructions: &[u8]
// ) -> ProgramResult {
//     let accs = &mut accounts.iter();
//     let data_acc = next_account_info(accs)?;

//     let mut data = data_acc.data.borrow_mut();

//     // Initialize on first write (account full of zeros)
//     let mut favourites = if data.iter().all(|&b| b == 0) {
//         Favourite {
//             name: "".to_string(),
//             color: "".to_string(),
//             number: 0,
//         }
//     } else {
//         Favourite::try_from_slice(&data)?
//     };

//     // Deserialize incoming favourite update
//     let new_fav = Favourite::try_from_slice(instructions)?;

//     favourites.name = new_fav.name;
//     favourites.color = new_fav.color;
//     favourites.number = new_fav.number;

//     // Serialize back
//     favourites.serialize(&mut &mut data[..])?;

//     Ok(())
// }











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