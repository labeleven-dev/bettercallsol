use anchor_lang::error_code;

#[error_code]
pub enum ErrorCode {
    #[msg("No Permission")]
    NoPermission,
    #[msg("Data out of bound")]
    DataOutOfBound,
}