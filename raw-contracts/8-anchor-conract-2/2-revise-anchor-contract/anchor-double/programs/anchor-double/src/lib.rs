use anchor_lang::prelude::*;

declare_id!("5EdHsixmYpfTEg1CALbd685NUXodqBhF5L6ePR3duZae");

#[program]
pub mod anchor_double {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let counter = &mut ctx.accounts.data_account;
        counter.count = 1;
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }

    pub fn double(ctx: Context<Modify>) -> Result<()> {
        let counter = &mut ctx.accounts.data_account;
        counter.count = counter
        .count
        .checked_mul(2)
        .ok_or(ErrorCode::Overflow)?;

        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }

    pub fn half(ctx: Context<Modify>) -> Result<()> {
        let counter = &mut ctx.accounts.data_account;
        if counter.count <= 1 {
            return Err(ErrorCode::InvalidValue.into());
        }
        counter.count /= 2;
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[account]
pub struct DataAccount {
    pub count: u32
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8+4)]
    pub data_account: Account<'info, DataAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>
}


#[derive(Accounts)]
pub struct Modify<'info> {
    #[account(mut)]
    pub data_account: Account<'info, DataAccount>,
}


#[error_code]
pub enum ErrorCode {
    #[msg("Invalid counter value")]
    InvalidValue,
    #[msg("Counter overflow")]
    Overflow
}