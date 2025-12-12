use solana_program::{account_info::{AccountInfo, next_account_info}, entrypoint, entrypoint::ProgramResult, 
instruction::{AccountMeta, Instruction}, program::invoke, pubkey::Pubkey
};

entrypoint!(process_instruction);

fn process_instruction(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    _instriction: &[u8]
) -> ProgramResult {
    let iter = &mut accounts.iter();
    
    let user_acc = next_account_info(iter)?;
    let data_acc = next_account_info(iter)?;
    let contract_acc = next_account_info(iter)?;

    let instructions = Instruction{
        program_id: *contract_acc.key,
        accounts: vec![AccountMeta{
            pubkey: *user_acc.key,
            is_signer:true,
            is_writable: false
        }, AccountMeta{
            pubkey: *data_acc.key,
            is_signer:false,
            is_writable:true
        }],
        data: vec![]
    };

    invoke(&instructions, &[user_acc.clone(), data_acc.clone(), contract_acc.clone()])?;    
    Ok(())

}