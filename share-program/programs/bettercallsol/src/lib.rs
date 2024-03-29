use anchor_lang::prelude::*;
use anchor_spl::token::*;
use borsh::{BorshDeserialize, BorshSerialize};

use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token;

use std::mem::size_of;

pub mod constants;
pub mod errors;

pub const PROGRAM_VERSION: u8 = 1;

const PREFIX: &str = "bcs";
const TRANSACTION_SEED: &str = "transaction";

declare_id!("HCcwD495j265Vqunp55pS8z64ddt9FnoswnBi61FH22S");

#[program]
pub mod bettercallsol {
    use super::*;

    pub fn initialize_transaction(
        ctx: Context<InitializeTransaction>,
        md5: [u8; 16],
        size: u16,
    ) -> Result<()> {
        msg!("initialize transaction");

        let mut transaction = ctx.accounts.transaction.load_init()?;
        transaction.version = PROGRAM_VERSION;
        transaction.bump = *ctx.bumps.get("transaction").unwrap();
        transaction.authority = ctx.accounts.authority.key();
        transaction.md5 = md5;
        transaction.size = size;

        Ok(())
    }

    pub fn update_transaction(
        ctx: Context<UpdateTransaction>,
        offset: u16,
        data: Vec<u8>,
    ) -> Result<()> {
        msg!("update transaction");
        let transaction = &mut ctx.accounts.transaction;
        let mut transaction_data = transaction.as_ref().data.borrow_mut();

        let size = data.len();
        let position = TRANSACTION_SIZE_START + offset as usize;

        if (position + size as usize) > transaction_data.len() {
            return Err(errors::ErrorCode::DataOutOfBound.into());
        }

        let array_slice: &mut [u8] = &mut transaction_data[position..(position + size as usize)];
        array_slice.copy_from_slice(&data.as_slice()[..]);

        Ok(())
    }

    pub fn delete_transaction(ctx: Context<DeleteTransaction>) -> Result<()> {
        msg!("delete transaction");
        let transaction = &mut ctx.accounts.transaction;
        let mut transaction_data = transaction.as_ref().data.borrow_mut();
        let size = transaction_data.len();
        let zeros = vec![0; size];
        let array_slice: &mut [u8] = &mut transaction_data[..];
        array_slice.copy_from_slice(&zeros.as_slice()[..]);

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(md5: [u8; 16], size: u16)]
pub struct InitializeTransaction<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
    init,
    seeds = [
    PREFIX.as_bytes(),
    TRANSACTION_SEED.as_bytes(),
    authority.key().as_ref(),
    & md5
    ],
    bump,
    payer = authority,
    space = 8 + size_of::< Transaction > () + size as usize
    )]
    pub transaction: AccountLoader<'info, Transaction>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
#[instruction(offset: u16)]
pub struct UpdateTransaction<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
    mut,
    constraint = transaction.load() ?.authority.key() == authority.key(),
    )]
    pub transaction: AccountLoader<'info, Transaction>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction()]
pub struct DeleteTransaction<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
    mut,
    constraint = transaction.load() ?.authority.key() == authority.key(),
    close = authority
    )]
    pub transaction: AccountLoader<'info, Transaction>,
    pub system_program: Program<'info, System>,
}

pub const TRANSACTION_SIZE_START: usize = 8 + // discriminator
    1 + // version
    1 + // bump
    32 + // authority
    16 + // md5
    2; // size

#[account(zero_copy)]
#[derive(Default)]
pub struct Transaction {
    pub version: u8,
    pub bump: u8,
    pub authority: Pubkey,
    pub md5: [u8; 16],
    pub size: u16,
}
// compressed data
