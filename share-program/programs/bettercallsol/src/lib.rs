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
const USER_SEED: &str = "user";
const COLLECTION_SEED: &str = "collection";
const TRANSACTION_SEED: &str = "transaction";

declare_id!("5JmbcHej3bKWA43BDpzWsqpfYM7gWdDBWsnYiJxHUE8s");

#[program]
pub mod bettercallsol {
    use super::*;
    use crate::spl_token::instruction::AuthorityType;

    pub fn initialize_user(ctx: Context<InitializeUser>) -> Result<()> {
        let mut user = ctx.accounts.user.load_init()?;
        user.version = PROGRAM_VERSION;
        user.bump = *ctx.bumps.get("user").unwrap();
        user.authority = ctx.accounts.authority.key();
        user.number_of_collections = 0;
        Ok(())
    }

    pub fn initialize_collection(ctx: Context<InitializeCollection>) -> Result<()> {
        let mut user = ctx.accounts.user.load_mut()?;

        let index = user.number_of_collections as usize;
        user.collections[index] = ctx.accounts.collection_mint.key();
        user.number_of_collections = user.number_of_collections + 1;

        let mut collection = ctx.accounts.collection.load_init()?;
        collection.version = PROGRAM_VERSION;
        collection.bump = *ctx.bumps.get("collection").unwrap();
        collection.authority = ctx.accounts.payer.key();
        collection.collection_mint = ctx.accounts.collection_mint.key();
        collection.number_of_access_key = 0;

        // mint 1
        token::mint_to(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info().clone(),
                token::MintTo {
                    mint: ctx.accounts.collection_mint.to_account_info().clone(),
                    to: ctx.accounts.collection_mint_vault.to_account_info().clone(),
                    authority: ctx.accounts.payer.to_account_info().clone(),
                },
            ),
            1,
        )?;

        // disable future minting
        token::set_authority(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info().clone(),
                token::SetAuthority {
                    current_authority: ctx.accounts.payer.to_account_info().clone(),
                    account_or_mint: ctx.accounts.collection_mint.to_account_info().clone(),
                },
            ),
            AuthorityType::MintTokens,
            None,
        )?;

        Ok(())
    }

    // todo: create access key

    pub fn initialize_transaction(
        ctx: Context<InitializeTransaction>,
        md5: [u8; 16],
        size: u16,
    ) -> Result<()> {
        msg!("initialize transaction");
        // permission check
        let collection = ctx.accounts.collection.load()?;
        let mut has_permission = false;
        if ctx.accounts.access_key.key() == collection.collection_mint.key() {
            has_permission = true;
        }
        // todo: nested struct in idl decoder of typescript
        // if !has_permission {
        //     let find_index = collection.access_keys.iter().position(|&access_key| access_key.access_key == ctx.accounts.access_key.key());
        //     if let Some(index) = find_index {
        //         if collection.access_keys[index].access_type != AccessType::CreateOnly || collection.access_keys[index].access_type != AccessType::CreateEdit {
        //             return Err(errors::ErrorCode::NoPermission.into());
        //         }
        //     } else {
        //         return Err(errors::ErrorCode::NoPermission.into());
        //     }
        //     has_permission = true;
        // }

        if !has_permission {
            return Err(errors::ErrorCode::NoPermission.into());
        }

        let mut transaction = ctx.accounts.transaction.load_init()?;
        transaction.version = PROGRAM_VERSION;
        transaction.bump = *ctx.bumps.get("transaction").unwrap();
        transaction.authority = collection.authority.key();
        transaction.collection_mint = collection.collection_mint.key();
        transaction.md5 = md5;
        transaction.size = size;

        msg!("{:?}", transaction.size);

        Ok(())
    }

    pub fn update_transaction(
        ctx: Context<UpdateTransaction>,
        offset: u16,
        size: u16,
        data: Vec<u8>,
    ) -> Result<()> {
        // permission check
        let collection = ctx.accounts.collection.load()?;
        let mut has_permission = false;
        if ctx.accounts.access_key.key() == collection.collection_mint.key() {
            has_permission = true;
        }
        // if !has_permission {
        //     let find_index = collection.access_keys.iter().position(|&access_key| access_key.access_key == ctx.accounts.access_key.key());
        //     if let Some(index) = find_index {
        //         if collection.access_keys[index].access_type != AccessType::EditOnly || collection.access_keys[index].access_type != AccessType::CreateEdit {
        //             return Err(errors::ErrorCode::NoPermission.into());
        //         }
        //     } else {
        //         return Err(errors::ErrorCode::NoPermission.into());
        //     }
        //     has_permission = true;
        // }

        if !has_permission {
            return Err(errors::ErrorCode::NoPermission.into());
        }

        let transaction = &mut ctx.accounts.transaction;
        let mut transaction_data = transaction.as_ref().data.borrow_mut();

        let position = TRANSACTION_SIZE_START + offset as usize;

        if (position + size as usize) > transaction_data.len() {
            return Err(errors::ErrorCode::DataOutOfBound.into());
        }

        let array_slice: &mut [u8] = &mut transaction_data[position..(position + size as usize)];
        array_slice.copy_from_slice(&data.as_slice()[..]);

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction()]
pub struct InitializeUser<'info> {
    #[account(mut)]
    authority: Signer<'info>,
    #[account(
    init,
    seeds = [
    PREFIX.as_bytes(),
    USER_SEED.as_bytes(),
    authority.key().as_ref(),
    ],
    bump,
    payer = authority,
    space = 8 + size_of::< User > ()
    )]
    user: AccountLoader<'info, User>,
    system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction()]
pub struct InitializeCollection<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
    mut,
    constraint = user.load() ?.authority == payer.key()
    )]
    pub user: AccountLoader<'info, User>,
    #[account(
    init,
    seeds = [
    PREFIX.as_bytes(),
    COLLECTION_SEED.as_bytes(),
    payer.key().as_ref(),
    collection_mint.key().as_ref(),
    ],
    bump,
    payer = payer,
    space = 8 + size_of::< Collection > ()
    )]
    pub collection: AccountLoader<'info, Collection>,
    #[account(
    init,
    mint::decimals = 0,
    mint::authority = payer,
    mint::freeze_authority = payer,
    payer = payer
    )]
    pub collection_mint: Box<Account<'info, Mint>>,
    #[account(
    init,
    associated_token::mint = collection_mint,
    associated_token::authority = payer,
    payer = payer
    )]
    pub collection_mint_vault: Box<Account<'info, TokenAccount>>,
    pub system_program: Program<'info, System>,
    #[account(address = token::ID)]
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
#[instruction(md5: [u8; 16], size: u16)]
pub struct InitializeTransaction<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    // CHECK: permission checks in function
    pub collection: AccountLoader<'info, Collection>,
    // CHECK: permission checks in function
    pub access_key: Box<Account<'info, Mint>>,
    #[account(
    constraint = access_key_vault.mint == access_key.key(),
    constraint = access_key_vault.amount > 0,
    constraint = access_key_vault.owner == payer.key(),
    )]
    pub access_key_vault: Box<Account<'info, TokenAccount>>,
    #[account(
    init,
    seeds = [
    PREFIX.as_bytes(),
    TRANSACTION_SEED.as_bytes(),
    collection.load() ?.authority.key().as_ref(),
    collection.key().as_ref(),
    & md5
    ],
    bump,
    payer = payer,
    space = 8 + size_of::< Transaction > () + size as usize
    )]
    pub transaction: AccountLoader<'info, Transaction>,
    pub system_program: Program<'info, System>,
    #[account(address = token::ID)]
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
#[instruction(offset: u32, size: u32)]
pub struct UpdateTransaction<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    // CHECK: permission checks in function
    pub collection: AccountLoader<'info, Collection>,
    // CHECK: permission checks in function
    pub access_key: Box<Account<'info, Mint>>,
    #[account(
    constraint = access_key_vault.mint == access_key.key(),
    constraint = access_key_vault.amount > 0,
    constraint = access_key_vault.owner == payer.key(),
    )]
    pub access_key_vault: Box<Account<'info, TokenAccount>>,
    #[account(
    mut,
    constraint = transaction.load() ?.collection_mint.key() == collection.load() ?.collection_mint.key(),
    )]
    pub transaction: AccountLoader<'info, Transaction>,
    pub system_program: Program<'info, System>,
    #[account(address = token::ID)]
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

#[account(zero_copy)]
#[derive(Default)]
pub struct User {
    pub version: u8,
    pub bump: u8,
    pub authority: Pubkey,
    pub number_of_collections: u8,
    pub collections: [Pubkey; 1],
}

#[account(zero_copy)]
#[derive(Default)]
pub struct Collection {
    pub version: u8,
    pub bump: u8,
    pub authority: Pubkey,
    pub collection_mint: Pubkey,
    pub number_of_access_key: u8,
    // pub access_keys: [AccessKey; 30],
}

#[account(zero_copy)]
#[derive(Default, AnchorSerialize, AnchorDeserialize)]
pub struct AccessKey {
    pub access_key: Pubkey,
    pub access_type: AccessType,
}

#[derive(Clone, Copy, Debug, PartialEq, BorshDeserialize, BorshSerialize)]
#[repr(u8)]
pub enum AccessType {
    Disabled = 0,
    CreateOnly = 1,
    EditOnly = 2,
    CreateEdit = 3,
}

impl Default for AccessType {
    fn default() -> Self {
        AccessType::Disabled
    }
}

pub const TRANSACTION_SIZE_START: usize = 8 + // discriminator
    1 + // version
    1 + // bump
    32 + // authority
    32 + // collection mint
    16 + // md5
    2; // size

#[account(zero_copy)]
#[derive(Default)]
pub struct Transaction {
    pub version: u8,
    pub bump: u8,
    pub authority: Pubkey,
    pub collection_mint: Pubkey,
    pub md5: [u8; 16],
    pub size: u16,
}
// compressed data
