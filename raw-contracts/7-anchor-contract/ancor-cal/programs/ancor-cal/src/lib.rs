use anchor_lang::prelude::*;

declare_id!("Ayhi2QiT3C5FspA7cR9QoXJCrgPtyNVKuvby2TA2GL1v");

#[program]
pub mod ancor_cal {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
