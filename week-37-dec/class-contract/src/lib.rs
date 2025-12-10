use solana_program::{
    account_info::{AccountInfo, next_account_info},
    entrypoint::ProgramResult,
    program::invoke_signed,
    entrypoint,
    pubkey::Pubkey,
    system_instruction,
    sysvar::{rent::Rent, Sysvar},
};

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    _ix: &[u8]
) -> ProgramResult {
    let iter = &mut accounts.iter();
    let pda = next_account_info(iter)?;
    let user = next_account_info(iter)?;
    let system_program = next_account_info(iter)?;

    let (pda_address, bump) = Pubkey::find_program_address(
        &[user.key.as_ref(), b"user"],
        program_id,
    );

    assert_eq!(pda_address, *pda.key);

    // Calculate minimum rent
    let rent = Rent::get()?.minimum_balance(8);

    let ix = system_instruction::create_account(
        user.key,
        pda.key,
        rent,
        8,
        program_id
    );

    // MUST include bump
    let seeds: &[&[u8]] = &[user.key.as_ref(), b"user", &[bump]];

    invoke_signed(&ix, &[user.clone(), pda.clone(), system_program.clone()], &[seeds])?;

    Ok(())
}
