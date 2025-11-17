use solana_program::{account_info::{AccountInfo, next_account_info}, entrypoint::ProgramResult, instruction::{AccountMeta, Instruction}, program::invoke, pubkey::Pubkey};



pub fn process_instruction(
    program_id: Pubkey,
    accounts: &[AccountInfo],
    instruction: &[u8]
) -> ProgramResult {
    let iter_acc = &mut accounts.iter();

    let data_acc = next_account_info(iter_acc)?;
    let program_acc = next_account_info(iter_acc)?;

    let ix = Instruction{
        program_id: *program_acc.key,
        accounts: vec![AccountMeta{
            is_signer: true,
            is_writable: true,
            pubkey: *data_acc.key
        }],
        data: vec![]
    };

    invoke(&ix, &[data_acc.clone(), program_acc.clone()])?;
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