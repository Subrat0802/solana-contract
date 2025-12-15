use anchor_lang::prelude::*;

declare_id!("Ayhi2QiT3C5FspA7cR9QoXJCrgPtyNVKuvby2TA2GL1v");

#[program]
pub mod ancor_cal {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, num: u32) -> Result<()> {
        ctx.accounts.new_account.count += num;
        msg!("Greetings from, Init: {:?}", ctx.program_id);
        Ok(())
    }
    pub fn add(ctx: Context<Add>, num: u32) -> Result<()> {
        ctx.accounts.new_account.count += num;
        msg!("Add value");
        Ok(())
    }
    pub fn sub(ctx: Context<Sub>, num: u32) -> Result<()> {
        ctx.accounts.new_account.count -= num;
        msg!("Sub value");
        Ok(())
    }
    pub fn mul(ctx: Context<Mul>, num: u32) -> Result<()> {
        ctx.accounts.new_account.count *= num;
        msg!("Mul value");
        Ok(())
    }
    pub fn div(ctx: Context<Div>, num: u32) -> Result<()> {
        ctx.accounts.new_account.count /= num;
        msg!("Div value");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer=signer, space = 8 + 8)]
    pub new_account: Account<'info, NewAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct Add<'info> {
    #[account(mut)]
    pub new_account: Account<'info, NewAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
}


#[derive(Accounts)]
pub struct Sub<'info> {
    #[account(mut)]
    pub new_account: Account<'info, NewAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
}

#[derive(Accounts)]
pub struct Mul<'info> {
    #[account(mut)]
    pub new_account: Account<'info, NewAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
}

#[derive(Accounts)]
pub struct Div<'info> {
    #[account(mut)]
    pub new_account: Account<'info, NewAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
}

#[account]
pub struct NewAccount {
    count: u32
}