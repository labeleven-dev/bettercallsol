import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace bettercallsol. */
export namespace bettercallsol {

    /** Properties of a Transaction. */
    interface ITransaction {

        /** Transaction version */
        version?: (string|null);

        /** Transaction network */
        network?: (bettercallsol.Transaction.Network|null);

        /** Transaction name */
        name?: (string|null);

        /** Transaction description */
        description?: (string|null);

        /** Transaction instructions */
        instructions?: (bettercallsol.Transaction.IInstruction[]|null);
    }

    /** Represents a Transaction. */
    class Transaction implements ITransaction {

        /**
         * Constructs a new Transaction.
         * @param [properties] Properties to set
         */
        constructor(properties?: bettercallsol.ITransaction);

        /** Transaction version. */
        public version: string;

        /** Transaction network. */
        public network: bettercallsol.Transaction.Network;

        /** Transaction name. */
        public name?: (string|null);

        /** Transaction description. */
        public description?: (string|null);

        /** Transaction instructions. */
        public instructions: bettercallsol.Transaction.IInstruction[];

        /** Transaction _name. */
        public _name?: "name";

        /** Transaction _description. */
        public _description?: "description";

        /**
         * Creates a new Transaction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Transaction instance
         */
        public static create(properties?: bettercallsol.ITransaction): bettercallsol.Transaction;

        /**
         * Encodes the specified Transaction message. Does not implicitly {@link bettercallsol.Transaction.verify|verify} messages.
         * @param message Transaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: bettercallsol.ITransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Transaction message, length delimited. Does not implicitly {@link bettercallsol.Transaction.verify|verify} messages.
         * @param message Transaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: bettercallsol.ITransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Transaction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Transaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): bettercallsol.Transaction;

        /**
         * Decodes a Transaction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Transaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): bettercallsol.Transaction;

        /**
         * Verifies a Transaction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Transaction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Transaction
         */
        public static fromObject(object: { [k: string]: any }): bettercallsol.Transaction;

        /**
         * Creates a plain object from a Transaction message. Also converts values to other types if specified.
         * @param message Transaction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: bettercallsol.Transaction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Transaction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Transaction
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace Transaction {

        /** Network enum. */
        enum Network {
            MAINNET_BETA = 0,
            TESTNET = 1,
            DEVNET = 2,
            CUSTOM = 3
        }

        /** Properties of an Instruction. */
        interface IInstruction {

            /** Instruction name */
            name?: (string|null);

            /** Instruction description */
            description?: (string|null);

            /** Instruction programId */
            programId?: (string|null);

            /** Instruction anchorMethod */
            anchorMethod?: (string|null);

            /** Instruction programMetadata */
            programMetadata?: (bettercallsol.Transaction.Instruction.IAccountMetadata|null);

            /** Instruction accounts */
            accounts?: (bettercallsol.Transaction.Instruction.IAccount[]|null);

            /** Instruction anchorAccounts */
            anchorAccounts?: (bettercallsol.Transaction.Instruction.IAccount[]|null);

            /** Instruction data */
            data?: (bettercallsol.Transaction.Instruction.IData|null);
        }

        /** Represents an Instruction. */
        class Instruction implements IInstruction {

            /**
             * Constructs a new Instruction.
             * @param [properties] Properties to set
             */
            constructor(properties?: bettercallsol.Transaction.IInstruction);

            /** Instruction name. */
            public name?: (string|null);

            /** Instruction description. */
            public description?: (string|null);

            /** Instruction programId. */
            public programId?: (string|null);

            /** Instruction anchorMethod. */
            public anchorMethod?: (string|null);

            /** Instruction programMetadata. */
            public programMetadata?: (bettercallsol.Transaction.Instruction.IAccountMetadata|null);

            /** Instruction accounts. */
            public accounts: bettercallsol.Transaction.Instruction.IAccount[];

            /** Instruction anchorAccounts. */
            public anchorAccounts: bettercallsol.Transaction.Instruction.IAccount[];

            /** Instruction data. */
            public data?: (bettercallsol.Transaction.Instruction.IData|null);

            /** Instruction _name. */
            public _name?: "name";

            /** Instruction _description. */
            public _description?: "description";

            /** Instruction _programId. */
            public _programId?: "programId";

            /** Instruction _anchorMethod. */
            public _anchorMethod?: "anchorMethod";

            /** Instruction _programMetadata. */
            public _programMetadata?: "programMetadata";

            /** Instruction _data. */
            public _data?: "data";

            /**
             * Creates a new Instruction instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Instruction instance
             */
            public static create(properties?: bettercallsol.Transaction.IInstruction): bettercallsol.Transaction.Instruction;

            /**
             * Encodes the specified Instruction message. Does not implicitly {@link bettercallsol.Transaction.Instruction.verify|verify} messages.
             * @param message Instruction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: bettercallsol.Transaction.IInstruction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Instruction message, length delimited. Does not implicitly {@link bettercallsol.Transaction.Instruction.verify|verify} messages.
             * @param message Instruction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: bettercallsol.Transaction.IInstruction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Instruction message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Instruction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): bettercallsol.Transaction.Instruction;

            /**
             * Decodes an Instruction message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Instruction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): bettercallsol.Transaction.Instruction;

            /**
             * Verifies an Instruction message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Instruction message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Instruction
             */
            public static fromObject(object: { [k: string]: any }): bettercallsol.Transaction.Instruction;

            /**
             * Creates a plain object from an Instruction message. Also converts values to other types if specified.
             * @param message Instruction
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: bettercallsol.Transaction.Instruction, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Instruction to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Instruction
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace Instruction {

            /** Properties of an AccountMetadata. */
            interface IAccountMetadata {

                /** AccountMetadata name */
                name?: (string|null);

                /** AccountMetadata mint */
                mint?: (string|null);

                /** AccountMetadata seeds */
                seeds?: (google.protobuf.IValue[]|null);

                /** AccountMetadata bump */
                bump?: (number|null);
            }

            /** Represents an AccountMetadata. */
            class AccountMetadata implements IAccountMetadata {

                /**
                 * Constructs a new AccountMetadata.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: bettercallsol.Transaction.Instruction.IAccountMetadata);

                /** AccountMetadata name. */
                public name?: (string|null);

                /** AccountMetadata mint. */
                public mint?: (string|null);

                /** AccountMetadata seeds. */
                public seeds: google.protobuf.IValue[];

                /** AccountMetadata bump. */
                public bump?: (number|null);

                /** AccountMetadata _name. */
                public _name?: "name";

                /** AccountMetadata _mint. */
                public _mint?: "mint";

                /** AccountMetadata _bump. */
                public _bump?: "bump";

                /**
                 * Creates a new AccountMetadata instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns AccountMetadata instance
                 */
                public static create(properties?: bettercallsol.Transaction.Instruction.IAccountMetadata): bettercallsol.Transaction.Instruction.AccountMetadata;

                /**
                 * Encodes the specified AccountMetadata message. Does not implicitly {@link bettercallsol.Transaction.Instruction.AccountMetadata.verify|verify} messages.
                 * @param message AccountMetadata message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: bettercallsol.Transaction.Instruction.IAccountMetadata, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified AccountMetadata message, length delimited. Does not implicitly {@link bettercallsol.Transaction.Instruction.AccountMetadata.verify|verify} messages.
                 * @param message AccountMetadata message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: bettercallsol.Transaction.Instruction.IAccountMetadata, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an AccountMetadata message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns AccountMetadata
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): bettercallsol.Transaction.Instruction.AccountMetadata;

                /**
                 * Decodes an AccountMetadata message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns AccountMetadata
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): bettercallsol.Transaction.Instruction.AccountMetadata;

                /**
                 * Verifies an AccountMetadata message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an AccountMetadata message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns AccountMetadata
                 */
                public static fromObject(object: { [k: string]: any }): bettercallsol.Transaction.Instruction.AccountMetadata;

                /**
                 * Creates a plain object from an AccountMetadata message. Also converts values to other types if specified.
                 * @param message AccountMetadata
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: bettercallsol.Transaction.Instruction.AccountMetadata, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this AccountMetadata to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for AccountMetadata
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of an Account. */
            interface IAccount {

                /** Account name */
                name?: (string|null);

                /** Account description */
                description?: (string|null);

                /** Account type */
                type?: (bettercallsol.Transaction.Instruction.Account.AccountType|null);

                /** Account pubkey */
                pubkey?: (string|null);

                /** Account isWritable */
                isWritable?: (boolean|null);

                /** Account isSigner */
                isSigner?: (boolean|null);

                /** Account metadata */
                metadata?: (bettercallsol.Transaction.Instruction.IAccountMetadata|null);
            }

            /** Represents an Account. */
            class Account implements IAccount {

                /**
                 * Constructs a new Account.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: bettercallsol.Transaction.Instruction.IAccount);

                /** Account name. */
                public name?: (string|null);

                /** Account description. */
                public description?: (string|null);

                /** Account type. */
                public type: bettercallsol.Transaction.Instruction.Account.AccountType;

                /** Account pubkey. */
                public pubkey?: (string|null);

                /** Account isWritable. */
                public isWritable: boolean;

                /** Account isSigner. */
                public isSigner: boolean;

                /** Account metadata. */
                public metadata?: (bettercallsol.Transaction.Instruction.IAccountMetadata|null);

                /** Account _name. */
                public _name?: "name";

                /** Account _description. */
                public _description?: "description";

                /** Account _pubkey. */
                public _pubkey?: "pubkey";

                /** Account _metadata. */
                public _metadata?: "metadata";

                /**
                 * Creates a new Account instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Account instance
                 */
                public static create(properties?: bettercallsol.Transaction.Instruction.IAccount): bettercallsol.Transaction.Instruction.Account;

                /**
                 * Encodes the specified Account message. Does not implicitly {@link bettercallsol.Transaction.Instruction.Account.verify|verify} messages.
                 * @param message Account message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: bettercallsol.Transaction.Instruction.IAccount, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Account message, length delimited. Does not implicitly {@link bettercallsol.Transaction.Instruction.Account.verify|verify} messages.
                 * @param message Account message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: bettercallsol.Transaction.Instruction.IAccount, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an Account message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Account
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): bettercallsol.Transaction.Instruction.Account;

                /**
                 * Decodes an Account message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Account
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): bettercallsol.Transaction.Instruction.Account;

                /**
                 * Verifies an Account message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an Account message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Account
                 */
                public static fromObject(object: { [k: string]: any }): bettercallsol.Transaction.Instruction.Account;

                /**
                 * Creates a plain object from an Account message. Also converts values to other types if specified.
                 * @param message Account
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: bettercallsol.Transaction.Instruction.Account, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Account to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Account
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            namespace Account {

                /** AccountType enum. */
                enum AccountType {
                    UNSPECIFIED = 0,
                    WALLET = 1,
                    KEYPAIR = 2,
                    PROGRAM = 3,
                    SYSVAR = 4,
                    PDA = 5,
                    ATA = 6
                }
            }

            /** Properties of a Data. */
            interface IData {

                /** Data format */
                format?: (bettercallsol.Transaction.Instruction.Data.DataFormat|null);

                /** Data rawValue */
                rawValue?: (bettercallsol.Transaction.Instruction.Data.IDataRaw|null);

                /** Data fieldValue */
                fieldValue?: (bettercallsol.Transaction.Instruction.Data.IDataField[]|null);
            }

            /** Represents a Data. */
            class Data implements IData {

                /**
                 * Constructs a new Data.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: bettercallsol.Transaction.Instruction.IData);

                /** Data format. */
                public format: bettercallsol.Transaction.Instruction.Data.DataFormat;

                /** Data rawValue. */
                public rawValue?: (bettercallsol.Transaction.Instruction.Data.IDataRaw|null);

                /** Data fieldValue. */
                public fieldValue: bettercallsol.Transaction.Instruction.Data.IDataField[];

                /** Data _rawValue. */
                public _rawValue?: "rawValue";

                /**
                 * Creates a new Data instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Data instance
                 */
                public static create(properties?: bettercallsol.Transaction.Instruction.IData): bettercallsol.Transaction.Instruction.Data;

                /**
                 * Encodes the specified Data message. Does not implicitly {@link bettercallsol.Transaction.Instruction.Data.verify|verify} messages.
                 * @param message Data message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: bettercallsol.Transaction.Instruction.IData, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Data message, length delimited. Does not implicitly {@link bettercallsol.Transaction.Instruction.Data.verify|verify} messages.
                 * @param message Data message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: bettercallsol.Transaction.Instruction.IData, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Data message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Data
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): bettercallsol.Transaction.Instruction.Data;

                /**
                 * Decodes a Data message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Data
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): bettercallsol.Transaction.Instruction.Data;

                /**
                 * Verifies a Data message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Data message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Data
                 */
                public static fromObject(object: { [k: string]: any }): bettercallsol.Transaction.Instruction.Data;

                /**
                 * Creates a plain object from a Data message. Also converts values to other types if specified.
                 * @param message Data
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: bettercallsol.Transaction.Instruction.Data, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Data to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Data
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            namespace Data {

                /** DataFormat enum. */
                enum DataFormat {
                    RAW = 0,
                    BUFFER_LAYOUT = 1,
                    BORSH = 2
                }

                /** Properties of a DataRaw. */
                interface IDataRaw {

                    /** DataRaw content */
                    content?: (string|null);

                    /** DataRaw encoding */
                    encoding?: (bettercallsol.Transaction.Instruction.Data.DataRaw.Encoding|null);

                    /** DataRaw description */
                    description?: (string|null);
                }

                /** Represents a DataRaw. */
                class DataRaw implements IDataRaw {

                    /**
                     * Constructs a new DataRaw.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: bettercallsol.Transaction.Instruction.Data.IDataRaw);

                    /** DataRaw content. */
                    public content: string;

                    /** DataRaw encoding. */
                    public encoding: bettercallsol.Transaction.Instruction.Data.DataRaw.Encoding;

                    /** DataRaw description. */
                    public description?: (string|null);

                    /** DataRaw _description. */
                    public _description?: "description";

                    /**
                     * Creates a new DataRaw instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns DataRaw instance
                     */
                    public static create(properties?: bettercallsol.Transaction.Instruction.Data.IDataRaw): bettercallsol.Transaction.Instruction.Data.DataRaw;

                    /**
                     * Encodes the specified DataRaw message. Does not implicitly {@link bettercallsol.Transaction.Instruction.Data.DataRaw.verify|verify} messages.
                     * @param message DataRaw message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: bettercallsol.Transaction.Instruction.Data.IDataRaw, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified DataRaw message, length delimited. Does not implicitly {@link bettercallsol.Transaction.Instruction.Data.DataRaw.verify|verify} messages.
                     * @param message DataRaw message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: bettercallsol.Transaction.Instruction.Data.IDataRaw, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a DataRaw message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns DataRaw
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): bettercallsol.Transaction.Instruction.Data.DataRaw;

                    /**
                     * Decodes a DataRaw message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns DataRaw
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): bettercallsol.Transaction.Instruction.Data.DataRaw;

                    /**
                     * Verifies a DataRaw message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a DataRaw message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns DataRaw
                     */
                    public static fromObject(object: { [k: string]: any }): bettercallsol.Transaction.Instruction.Data.DataRaw;

                    /**
                     * Creates a plain object from a DataRaw message. Also converts values to other types if specified.
                     * @param message DataRaw
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: bettercallsol.Transaction.Instruction.Data.DataRaw, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this DataRaw to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for DataRaw
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                namespace DataRaw {

                    /** Encoding enum. */
                    enum Encoding {
                        HEX = 0,
                        BS58 = 1
                    }
                }

                /** Properties of a DataField. */
                interface IDataField {

                    /** DataField name */
                    name?: (string|null);

                    /** DataField description */
                    description?: (string|null);

                    /** DataField type */
                    type?: (bettercallsol.Transaction.Instruction.Data.DataField.DataFieldType|null);

                    /** DataField value */
                    value?: (google.protobuf.IValue|null);
                }

                /** Represents a DataField. */
                class DataField implements IDataField {

                    /**
                     * Constructs a new DataField.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: bettercallsol.Transaction.Instruction.Data.IDataField);

                    /** DataField name. */
                    public name?: (string|null);

                    /** DataField description. */
                    public description?: (string|null);

                    /** DataField type. */
                    public type: bettercallsol.Transaction.Instruction.Data.DataField.DataFieldType;

                    /** DataField value. */
                    public value?: (google.protobuf.IValue|null);

                    /** DataField _name. */
                    public _name?: "name";

                    /** DataField _description. */
                    public _description?: "description";

                    /**
                     * Creates a new DataField instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns DataField instance
                     */
                    public static create(properties?: bettercallsol.Transaction.Instruction.Data.IDataField): bettercallsol.Transaction.Instruction.Data.DataField;

                    /**
                     * Encodes the specified DataField message. Does not implicitly {@link bettercallsol.Transaction.Instruction.Data.DataField.verify|verify} messages.
                     * @param message DataField message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: bettercallsol.Transaction.Instruction.Data.IDataField, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified DataField message, length delimited. Does not implicitly {@link bettercallsol.Transaction.Instruction.Data.DataField.verify|verify} messages.
                     * @param message DataField message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: bettercallsol.Transaction.Instruction.Data.IDataField, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a DataField message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns DataField
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): bettercallsol.Transaction.Instruction.Data.DataField;

                    /**
                     * Decodes a DataField message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns DataField
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): bettercallsol.Transaction.Instruction.Data.DataField;

                    /**
                     * Verifies a DataField message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a DataField message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns DataField
                     */
                    public static fromObject(object: { [k: string]: any }): bettercallsol.Transaction.Instruction.Data.DataField;

                    /**
                     * Creates a plain object from a DataField message. Also converts values to other types if specified.
                     * @param message DataField
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: bettercallsol.Transaction.Instruction.Data.DataField, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this DataField to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for DataField
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                namespace DataField {

                    /** DataFieldType enum. */
                    enum DataFieldType {
                        UNSUPPORTED = 0,
                        U8 = 1,
                        I8 = 2,
                        U16 = 3,
                        I16 = 4,
                        U32 = 5,
                        I32 = 6,
                        F32 = 7,
                        U64 = 8,
                        I64 = 9,
                        F64 = 10,
                        U128 = 11,
                        I128 = 12,
                        BOOL = 13,
                        BYTES = 14,
                        PUBLIC_KEY = 15,
                        STRING = 16
                    }
                }
            }
        }
    }
}

/** Namespace google. */
export namespace google {

    /** Namespace protobuf. */
    namespace protobuf {

        /** Properties of a Struct. */
        interface IStruct {

            /** Struct fields */
            fields?: ({ [k: string]: google.protobuf.IValue }|null);
        }

        /** Represents a Struct. */
        class Struct implements IStruct {

            /**
             * Constructs a new Struct.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IStruct);

            /** Struct fields. */
            public fields: { [k: string]: google.protobuf.IValue };

            /**
             * Creates a new Struct instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Struct instance
             */
            public static create(properties?: google.protobuf.IStruct): google.protobuf.Struct;

            /**
             * Encodes the specified Struct message. Does not implicitly {@link google.protobuf.Struct.verify|verify} messages.
             * @param message Struct message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IStruct, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Struct message, length delimited. Does not implicitly {@link google.protobuf.Struct.verify|verify} messages.
             * @param message Struct message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IStruct, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Struct message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Struct
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Struct;

            /**
             * Decodes a Struct message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Struct
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.Struct;

            /**
             * Verifies a Struct message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Struct message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Struct
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.Struct;

            /**
             * Creates a plain object from a Struct message. Also converts values to other types if specified.
             * @param message Struct
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.Struct, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Struct to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Struct
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a Value. */
        interface IValue {

            /** Value nullValue */
            nullValue?: (google.protobuf.NullValue|null);

            /** Value numberValue */
            numberValue?: (number|null);

            /** Value stringValue */
            stringValue?: (string|null);

            /** Value boolValue */
            boolValue?: (boolean|null);

            /** Value structValue */
            structValue?: (google.protobuf.IStruct|null);

            /** Value listValue */
            listValue?: (google.protobuf.IListValue|null);
        }

        /** Represents a Value. */
        class Value implements IValue {

            /**
             * Constructs a new Value.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IValue);

            /** Value nullValue. */
            public nullValue?: (google.protobuf.NullValue|null);

            /** Value numberValue. */
            public numberValue?: (number|null);

            /** Value stringValue. */
            public stringValue?: (string|null);

            /** Value boolValue. */
            public boolValue?: (boolean|null);

            /** Value structValue. */
            public structValue?: (google.protobuf.IStruct|null);

            /** Value listValue. */
            public listValue?: (google.protobuf.IListValue|null);

            /** Value kind. */
            public kind?: ("nullValue"|"numberValue"|"stringValue"|"boolValue"|"structValue"|"listValue");

            /**
             * Creates a new Value instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Value instance
             */
            public static create(properties?: google.protobuf.IValue): google.protobuf.Value;

            /**
             * Encodes the specified Value message. Does not implicitly {@link google.protobuf.Value.verify|verify} messages.
             * @param message Value message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Value message, length delimited. Does not implicitly {@link google.protobuf.Value.verify|verify} messages.
             * @param message Value message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Value message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Value;

            /**
             * Decodes a Value message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.Value;

            /**
             * Verifies a Value message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Value message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Value
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.Value;

            /**
             * Creates a plain object from a Value message. Also converts values to other types if specified.
             * @param message Value
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.Value, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Value to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Value
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** NullValue enum. */
        enum NullValue {
            NULL_VALUE = 0
        }

        /** Properties of a ListValue. */
        interface IListValue {

            /** ListValue values */
            values?: (google.protobuf.IValue[]|null);
        }

        /** Represents a ListValue. */
        class ListValue implements IListValue {

            /**
             * Constructs a new ListValue.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IListValue);

            /** ListValue values. */
            public values: google.protobuf.IValue[];

            /**
             * Creates a new ListValue instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ListValue instance
             */
            public static create(properties?: google.protobuf.IListValue): google.protobuf.ListValue;

            /**
             * Encodes the specified ListValue message. Does not implicitly {@link google.protobuf.ListValue.verify|verify} messages.
             * @param message ListValue message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IListValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ListValue message, length delimited. Does not implicitly {@link google.protobuf.ListValue.verify|verify} messages.
             * @param message ListValue message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IListValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ListValue message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ListValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.ListValue;

            /**
             * Decodes a ListValue message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ListValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.ListValue;

            /**
             * Verifies a ListValue message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ListValue message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ListValue
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.ListValue;

            /**
             * Creates a plain object from a ListValue message. Also converts values to other types if specified.
             * @param message ListValue
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.ListValue, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ListValue to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ListValue
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }
    }
}
