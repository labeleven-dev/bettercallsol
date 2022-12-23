import { TransactionResponse } from "@solana/web3.js";
import { IBalance } from "types/internal";

export const extractBalances = (
  transaction: TransactionResponse
): IBalance[] => {
  const { accountKeys } = transaction.transaction.message;
  const { preBalances, postBalances } = transaction.meta!;

  return accountKeys.map((address, index) => ({
    address: address.toBase58(),
    before: preBalances[index],
    after: postBalances[index],
  }));
};

export const mapWeb3TransactionError = (err: any): string => {
  if (!err) return "";

  let error = "Unexpected error";

  if (typeof err === "string" || err instanceof String) {
    error = err as string;
  } else {
    // this doesn't seem to match web3.js types but still comes back from RPC endpoint 🤷
    const errObject = err as Record<string, any>;
    if (errObject?.InstructionError) {
      const [index, errorCode] = errObject.InstructionError;
      error = `Error at Instruction #${index + 1}: ${JSON.stringify(
        errorCode
      )}`;
    }
  }

  return error;
};
