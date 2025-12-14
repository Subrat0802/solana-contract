use solana_program::{account_info::{AccountInfo, next_account_info}, entrypoint, entrypoint::ProgramResult, program::invoke_signed, pubkey::Pubkey, rent::Rent, system_instruction, sysvar::Sysvar};

entrypoint!(process_instruction);

fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    _instruction: &[u8]
) -> ProgramResult {
    let iter = &mut accounts.iter();
    let user_account = next_account_info(iter)?;
    let pda_account = next_account_info(iter)?;
    let system_program = next_account_info(iter)?;

    let (pde_address, bump) = Pubkey::find_program_address(
        &[user_account.key.as_ref(), b"user"], program_id);

    assert_eq!(*pda_account.key, pde_address);

    let rent = Rent::get()?.minimum_balance(8);

    let ix = system_instruction::create_account(
        user_account.key, 
        pda_account.key, 
        rent, 
        8, 
        program_id
    );

    let seeds = &[user_account.key.as_ref(), b"user", &[bump]];

    invoke_signed(
        &ix, 
        &[user_account.clone(), pda_account.clone(), system_program.clone()], 
        &[seeds]
    )?;

    Ok(())
}