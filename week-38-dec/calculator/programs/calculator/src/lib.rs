use anchor_lang::prelude::*;

declare_id!("67SAoUQ99T2x7YMbC4eowVwT6sRyqmwtRVztWjsrsGmC");

#[program]
pub mod calculator {
    use super::*;

    pub fn init(ctx: Context<Initialize>, init_value: u32) -> Result<()> {
        ctx.accounts.account.num = init_value;
        Ok(())
    }

    pub fn double(ctx: Context<Double>) -> Result<()> {
        ctx.accounts.account.num *= 2;
        Ok(())
    }
    
    pub fn add(ctx: Context<Add>, num: u32) -> Result<()> {
        ctx.accounts.account.num += num;
        Ok(())
    }

}


#[account]
struct DataShape {
    pub num: u32
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = signer, space = 8 + 4)]
    account: Account<'info, DataShape>,
    #[account(mut)]
    signer: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct Double<'info> {
    #[account(mut)]
    account: Account<'info, DataShape>,
    #[account(mut)]
    signer: Signer<'info>
}

#[derive(Accounts)]
pub struct Add<'info> {
    #[account(mut)]
    account: Account<'info, DataShape>,
    #[account(mut)]
    signer: Signer<'info>
}