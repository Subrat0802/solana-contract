use solana_program::{account_info::{AccountInfo, next_account_info}, 
    entrypoint::ProgramResult, 
    entrypoint, 
    instruction::{AccountMeta, Instruction}, 
    program::invoke, 
    pubkey::Pubkey
};

entrypoint!(process_instructions);

// cpi double contract
pub fn process_instructions(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    instructions: &[u8]
) -> ProgramResult {

    let mut accs = accounts.iter();
    let data_accs = next_account_info(&mut accs)?;
    let double_cont = next_account_info(&mut accs)?;

    let instruction = Instruction{
        program_id:*double_cont.key,
        accounts: vec![AccountMeta{
            is_signer: true,
            is_writable: true,
            pubkey: *data_accs.key
        }],
        data: vec![]
    };

    invoke(&instruction, &[data_accs.clone(), double_cont.clone()])?;
    Ok(())
}














//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//double

// use borsh::{BorshDeserialize, BorshSerialize};
// use solana_program::{account_info::{AccountInfo, next_account_info}, entrypoint::ProgramResult, entrypoint, pubkey::Pubkey};

// entrypoint!(process_instruction);

// #[derive(BorshDeserialize, BorshSerialize)]
// struct Counter {
//     count: u32
// }

// pub fn process_instruction(
//     program_id: &Pubkey,
//     accounts: &[AccountInfo],
//     insctruction: &[u8]
// ) -> ProgramResult {
//     let iter_accs = &mut accounts.iter();
//     let data_accs = next_account_info(iter_accs)?;

//     let mut counter = Counter::try_from_slice(&mut data_accs.data.borrow_mut())?;

//     if counter.count == 0 {
//         counter.count = 1;
//     }else{
//         counter.count *= 2;
//     }

//     counter.serialize(&mut *data_accs.data.borrow_mut())?;
//     Ok(())
// }