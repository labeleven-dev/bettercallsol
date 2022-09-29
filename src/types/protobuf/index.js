/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const bettercallsol = $root.bettercallsol = (() => {

    /**
     * Namespace bettercallsol.
     * @exports bettercallsol
     * @namespace
     */
    const bettercallsol = {};

    bettercallsol.Transaction = (function() {

        /**
         * Properties of a Transaction.
         * @memberof bettercallsol
         * @interface ITransaction
         * @property {string|null} [version] Transaction version
         * @property {bettercallsol.Transaction.Network|null} [network] Transaction network
         * @property {string|null} [name] Transaction name
         * @property {string|null} [description] Transaction description
         * @property {Array.<bettercallsol.Transaction.IInstruction>|null} [instructions] Transaction instructions
         */

        /**
         * Constructs a new Transaction.
         * @memberof bettercallsol
         * @classdesc Represents a Transaction.
         * @implements ITransaction
         * @constructor
         * @param {bettercallsol.ITransaction=} [properties] Properties to set
         */
        function Transaction(properties) {
            this.instructions = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Transaction version.
         * @member {string} version
         * @memberof bettercallsol.Transaction
         * @instance
         */
        Transaction.prototype.version = "";

        /**
         * Transaction network.
         * @member {bettercallsol.Transaction.Network} network
         * @memberof bettercallsol.Transaction
         * @instance
         */
        Transaction.prototype.network = 0;

        /**
         * Transaction name.
         * @member {string|null|undefined} name
         * @memberof bettercallsol.Transaction
         * @instance
         */
        Transaction.prototype.name = null;

        /**
         * Transaction description.
         * @member {string|null|undefined} description
         * @memberof bettercallsol.Transaction
         * @instance
         */
        Transaction.prototype.description = null;

        /**
         * Transaction instructions.
         * @member {Array.<bettercallsol.Transaction.IInstruction>} instructions
         * @memberof bettercallsol.Transaction
         * @instance
         */
        Transaction.prototype.instructions = $util.emptyArray;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        /**
         * Transaction _name.
         * @member {"name"|undefined} _name
         * @memberof bettercallsol.Transaction
         * @instance
         */
        Object.defineProperty(Transaction.prototype, "_name", {
            get: $util.oneOfGetter($oneOfFields = ["name"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Transaction _description.
         * @member {"description"|undefined} _description
         * @memberof bettercallsol.Transaction
         * @instance
         */
        Object.defineProperty(Transaction.prototype, "_description", {
            get: $util.oneOfGetter($oneOfFields = ["description"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new Transaction instance using the specified properties.
         * @function create
         * @memberof bettercallsol.Transaction
         * @static
         * @param {bettercallsol.ITransaction=} [properties] Properties to set
         * @returns {bettercallsol.Transaction} Transaction instance
         */
        Transaction.create = function create(properties) {
            return new Transaction(properties);
        };

        /**
         * Encodes the specified Transaction message. Does not implicitly {@link bettercallsol.Transaction.verify|verify} messages.
         * @function encode
         * @memberof bettercallsol.Transaction
         * @static
         * @param {bettercallsol.ITransaction} message Transaction message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Transaction.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.version != null && Object.hasOwnProperty.call(message, "version"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.version);
            if (message.network != null && Object.hasOwnProperty.call(message, "network"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.network);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.name);
            if (message.description != null && Object.hasOwnProperty.call(message, "description"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.description);
            if (message.instructions != null && message.instructions.length)
                for (let i = 0; i < message.instructions.length; ++i)
                    $root.bettercallsol.Transaction.Instruction.encode(message.instructions[i], writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified Transaction message, length delimited. Does not implicitly {@link bettercallsol.Transaction.verify|verify} messages.
         * @function encodeDelimited
         * @memberof bettercallsol.Transaction
         * @static
         * @param {bettercallsol.ITransaction} message Transaction message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Transaction.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Transaction message from the specified reader or buffer.
         * @function decode
         * @memberof bettercallsol.Transaction
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {bettercallsol.Transaction} Transaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Transaction.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.bettercallsol.Transaction();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.version = reader.string();
                        break;
                    }
                case 2: {
                        message.network = reader.int32();
                        break;
                    }
                case 3: {
                        message.name = reader.string();
                        break;
                    }
                case 4: {
                        message.description = reader.string();
                        break;
                    }
                case 5: {
                        if (!(message.instructions && message.instructions.length))
                            message.instructions = [];
                        message.instructions.push($root.bettercallsol.Transaction.Instruction.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Transaction message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof bettercallsol.Transaction
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {bettercallsol.Transaction} Transaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Transaction.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Transaction message.
         * @function verify
         * @memberof bettercallsol.Transaction
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Transaction.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            let properties = {};
            if (message.version != null && message.hasOwnProperty("version"))
                if (!$util.isString(message.version))
                    return "version: string expected";
            if (message.network != null && message.hasOwnProperty("network"))
                switch (message.network) {
                default:
                    return "network: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.name != null && message.hasOwnProperty("name")) {
                properties._name = 1;
                if (!$util.isString(message.name))
                    return "name: string expected";
            }
            if (message.description != null && message.hasOwnProperty("description")) {
                properties._description = 1;
                if (!$util.isString(message.description))
                    return "description: string expected";
            }
            if (message.instructions != null && message.hasOwnProperty("instructions")) {
                if (!Array.isArray(message.instructions))
                    return "instructions: array expected";
                for (let i = 0; i < message.instructions.length; ++i) {
                    let error = $root.bettercallsol.Transaction.Instruction.verify(message.instructions[i]);
                    if (error)
                        return "instructions." + error;
                }
            }
            return null;
        };

        /**
         * Creates a Transaction message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof bettercallsol.Transaction
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {bettercallsol.Transaction} Transaction
         */
        Transaction.fromObject = function fromObject(object) {
            if (object instanceof $root.bettercallsol.Transaction)
                return object;
            let message = new $root.bettercallsol.Transaction();
            if (object.version != null)
                message.version = String(object.version);
            switch (object.network) {
            default:
                if (typeof object.network === "number") {
                    message.network = object.network;
                    break;
                }
                break;
            case "MAINNET_BETA":
            case 0:
                message.network = 0;
                break;
            case "TESTNET":
            case 1:
                message.network = 1;
                break;
            case "DEVNET":
            case 2:
                message.network = 2;
                break;
            case "CUSTOM":
            case 3:
                message.network = 3;
                break;
            }
            if (object.name != null)
                message.name = String(object.name);
            if (object.description != null)
                message.description = String(object.description);
            if (object.instructions) {
                if (!Array.isArray(object.instructions))
                    throw TypeError(".bettercallsol.Transaction.instructions: array expected");
                message.instructions = [];
                for (let i = 0; i < object.instructions.length; ++i) {
                    if (typeof object.instructions[i] !== "object")
                        throw TypeError(".bettercallsol.Transaction.instructions: object expected");
                    message.instructions[i] = $root.bettercallsol.Transaction.Instruction.fromObject(object.instructions[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a Transaction message. Also converts values to other types if specified.
         * @function toObject
         * @memberof bettercallsol.Transaction
         * @static
         * @param {bettercallsol.Transaction} message Transaction
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Transaction.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.instructions = [];
            if (options.defaults) {
                object.version = "";
                object.network = options.enums === String ? "MAINNET_BETA" : 0;
            }
            if (message.version != null && message.hasOwnProperty("version"))
                object.version = message.version;
            if (message.network != null && message.hasOwnProperty("network"))
                object.network = options.enums === String ? $root.bettercallsol.Transaction.Network[message.network] === undefined ? message.network : $root.bettercallsol.Transaction.Network[message.network] : message.network;
            if (message.name != null && message.hasOwnProperty("name")) {
                object.name = message.name;
                if (options.oneofs)
                    object._name = "name";
            }
            if (message.description != null && message.hasOwnProperty("description")) {
                object.description = message.description;
                if (options.oneofs)
                    object._description = "description";
            }
            if (message.instructions && message.instructions.length) {
                object.instructions = [];
                for (let j = 0; j < message.instructions.length; ++j)
                    object.instructions[j] = $root.bettercallsol.Transaction.Instruction.toObject(message.instructions[j], options);
            }
            return object;
        };

        /**
         * Converts this Transaction to JSON.
         * @function toJSON
         * @memberof bettercallsol.Transaction
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Transaction.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Transaction
         * @function getTypeUrl
         * @memberof bettercallsol.Transaction
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Transaction.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/bettercallsol.Transaction";
        };

        /**
         * Network enum.
         * @name bettercallsol.Transaction.Network
         * @enum {number}
         * @property {number} MAINNET_BETA=0 MAINNET_BETA value
         * @property {number} TESTNET=1 TESTNET value
         * @property {number} DEVNET=2 DEVNET value
         * @property {number} CUSTOM=3 CUSTOM value
         */
        Transaction.Network = (function() {
            const valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "MAINNET_BETA"] = 0;
            values[valuesById[1] = "TESTNET"] = 1;
            values[valuesById[2] = "DEVNET"] = 2;
            values[valuesById[3] = "CUSTOM"] = 3;
            return values;
        })();

        Transaction.Instruction = (function() {

            /**
             * Properties of an Instruction.
             * @memberof bettercallsol.Transaction
             * @interface IInstruction
             * @property {string|null} [name] Instruction name
             * @property {string|null} [description] Instruction description
             * @property {string|null} [programId] Instruction programId
             * @property {string|null} [anchorMethod] Instruction anchorMethod
             * @property {bettercallsol.Transaction.Instruction.IAccountMetadata|null} [programMetadata] Instruction programMetadata
             * @property {Array.<bettercallsol.Transaction.Instruction.IAccount>|null} [accounts] Instruction accounts
             * @property {Array.<bettercallsol.Transaction.Instruction.IAccount>|null} [anchorAccounts] Instruction anchorAccounts
             * @property {bettercallsol.Transaction.Instruction.IData|null} [data] Instruction data
             */

            /**
             * Constructs a new Instruction.
             * @memberof bettercallsol.Transaction
             * @classdesc Represents an Instruction.
             * @implements IInstruction
             * @constructor
             * @param {bettercallsol.Transaction.IInstruction=} [properties] Properties to set
             */
            function Instruction(properties) {
                this.accounts = [];
                this.anchorAccounts = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Instruction name.
             * @member {string|null|undefined} name
             * @memberof bettercallsol.Transaction.Instruction
             * @instance
             */
            Instruction.prototype.name = null;

            /**
             * Instruction description.
             * @member {string|null|undefined} description
             * @memberof bettercallsol.Transaction.Instruction
             * @instance
             */
            Instruction.prototype.description = null;

            /**
             * Instruction programId.
             * @member {string|null|undefined} programId
             * @memberof bettercallsol.Transaction.Instruction
             * @instance
             */
            Instruction.prototype.programId = null;

            /**
             * Instruction anchorMethod.
             * @member {string|null|undefined} anchorMethod
             * @memberof bettercallsol.Transaction.Instruction
             * @instance
             */
            Instruction.prototype.anchorMethod = null;

            /**
             * Instruction programMetadata.
             * @member {bettercallsol.Transaction.Instruction.IAccountMetadata|null|undefined} programMetadata
             * @memberof bettercallsol.Transaction.Instruction
             * @instance
             */
            Instruction.prototype.programMetadata = null;

            /**
             * Instruction accounts.
             * @member {Array.<bettercallsol.Transaction.Instruction.IAccount>} accounts
             * @memberof bettercallsol.Transaction.Instruction
             * @instance
             */
            Instruction.prototype.accounts = $util.emptyArray;

            /**
             * Instruction anchorAccounts.
             * @member {Array.<bettercallsol.Transaction.Instruction.IAccount>} anchorAccounts
             * @memberof bettercallsol.Transaction.Instruction
             * @instance
             */
            Instruction.prototype.anchorAccounts = $util.emptyArray;

            /**
             * Instruction data.
             * @member {bettercallsol.Transaction.Instruction.IData|null|undefined} data
             * @memberof bettercallsol.Transaction.Instruction
             * @instance
             */
            Instruction.prototype.data = null;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * Instruction _name.
             * @member {"name"|undefined} _name
             * @memberof bettercallsol.Transaction.Instruction
             * @instance
             */
            Object.defineProperty(Instruction.prototype, "_name", {
                get: $util.oneOfGetter($oneOfFields = ["name"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Instruction _description.
             * @member {"description"|undefined} _description
             * @memberof bettercallsol.Transaction.Instruction
             * @instance
             */
            Object.defineProperty(Instruction.prototype, "_description", {
                get: $util.oneOfGetter($oneOfFields = ["description"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Instruction _programId.
             * @member {"programId"|undefined} _programId
             * @memberof bettercallsol.Transaction.Instruction
             * @instance
             */
            Object.defineProperty(Instruction.prototype, "_programId", {
                get: $util.oneOfGetter($oneOfFields = ["programId"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Instruction _anchorMethod.
             * @member {"anchorMethod"|undefined} _anchorMethod
             * @memberof bettercallsol.Transaction.Instruction
             * @instance
             */
            Object.defineProperty(Instruction.prototype, "_anchorMethod", {
                get: $util.oneOfGetter($oneOfFields = ["anchorMethod"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Instruction _programMetadata.
             * @member {"programMetadata"|undefined} _programMetadata
             * @memberof bettercallsol.Transaction.Instruction
             * @instance
             */
            Object.defineProperty(Instruction.prototype, "_programMetadata", {
                get: $util.oneOfGetter($oneOfFields = ["programMetadata"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Instruction _data.
             * @member {"data"|undefined} _data
             * @memberof bettercallsol.Transaction.Instruction
             * @instance
             */
            Object.defineProperty(Instruction.prototype, "_data", {
                get: $util.oneOfGetter($oneOfFields = ["data"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new Instruction instance using the specified properties.
             * @function create
             * @memberof bettercallsol.Transaction.Instruction
             * @static
             * @param {bettercallsol.Transaction.IInstruction=} [properties] Properties to set
             * @returns {bettercallsol.Transaction.Instruction} Instruction instance
             */
            Instruction.create = function create(properties) {
                return new Instruction(properties);
            };

            /**
             * Encodes the specified Instruction message. Does not implicitly {@link bettercallsol.Transaction.Instruction.verify|verify} messages.
             * @function encode
             * @memberof bettercallsol.Transaction.Instruction
             * @static
             * @param {bettercallsol.Transaction.IInstruction} message Instruction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Instruction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
                if (message.description != null && Object.hasOwnProperty.call(message, "description"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.description);
                if (message.programId != null && Object.hasOwnProperty.call(message, "programId"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.programId);
                if (message.anchorMethod != null && Object.hasOwnProperty.call(message, "anchorMethod"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.anchorMethod);
                if (message.programMetadata != null && Object.hasOwnProperty.call(message, "programMetadata"))
                    $root.bettercallsol.Transaction.Instruction.AccountMetadata.encode(message.programMetadata, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                if (message.accounts != null && message.accounts.length)
                    for (let i = 0; i < message.accounts.length; ++i)
                        $root.bettercallsol.Transaction.Instruction.Account.encode(message.accounts[i], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                if (message.anchorAccounts != null && message.anchorAccounts.length)
                    for (let i = 0; i < message.anchorAccounts.length; ++i)
                        $root.bettercallsol.Transaction.Instruction.Account.encode(message.anchorAccounts[i], writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
                if (message.data != null && Object.hasOwnProperty.call(message, "data"))
                    $root.bettercallsol.Transaction.Instruction.Data.encode(message.data, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified Instruction message, length delimited. Does not implicitly {@link bettercallsol.Transaction.Instruction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof bettercallsol.Transaction.Instruction
             * @static
             * @param {bettercallsol.Transaction.IInstruction} message Instruction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Instruction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an Instruction message from the specified reader or buffer.
             * @function decode
             * @memberof bettercallsol.Transaction.Instruction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {bettercallsol.Transaction.Instruction} Instruction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Instruction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.bettercallsol.Transaction.Instruction();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.name = reader.string();
                            break;
                        }
                    case 2: {
                            message.description = reader.string();
                            break;
                        }
                    case 3: {
                            message.programId = reader.string();
                            break;
                        }
                    case 4: {
                            message.anchorMethod = reader.string();
                            break;
                        }
                    case 5: {
                            message.programMetadata = $root.bettercallsol.Transaction.Instruction.AccountMetadata.decode(reader, reader.uint32());
                            break;
                        }
                    case 6: {
                            if (!(message.accounts && message.accounts.length))
                                message.accounts = [];
                            message.accounts.push($root.bettercallsol.Transaction.Instruction.Account.decode(reader, reader.uint32()));
                            break;
                        }
                    case 7: {
                            if (!(message.anchorAccounts && message.anchorAccounts.length))
                                message.anchorAccounts = [];
                            message.anchorAccounts.push($root.bettercallsol.Transaction.Instruction.Account.decode(reader, reader.uint32()));
                            break;
                        }
                    case 8: {
                            message.data = $root.bettercallsol.Transaction.Instruction.Data.decode(reader, reader.uint32());
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an Instruction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof bettercallsol.Transaction.Instruction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {bettercallsol.Transaction.Instruction} Instruction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Instruction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an Instruction message.
             * @function verify
             * @memberof bettercallsol.Transaction.Instruction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Instruction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.name != null && message.hasOwnProperty("name")) {
                    properties._name = 1;
                    if (!$util.isString(message.name))
                        return "name: string expected";
                }
                if (message.description != null && message.hasOwnProperty("description")) {
                    properties._description = 1;
                    if (!$util.isString(message.description))
                        return "description: string expected";
                }
                if (message.programId != null && message.hasOwnProperty("programId")) {
                    properties._programId = 1;
                    if (!$util.isString(message.programId))
                        return "programId: string expected";
                }
                if (message.anchorMethod != null && message.hasOwnProperty("anchorMethod")) {
                    properties._anchorMethod = 1;
                    if (!$util.isString(message.anchorMethod))
                        return "anchorMethod: string expected";
                }
                if (message.programMetadata != null && message.hasOwnProperty("programMetadata")) {
                    properties._programMetadata = 1;
                    {
                        let error = $root.bettercallsol.Transaction.Instruction.AccountMetadata.verify(message.programMetadata);
                        if (error)
                            return "programMetadata." + error;
                    }
                }
                if (message.accounts != null && message.hasOwnProperty("accounts")) {
                    if (!Array.isArray(message.accounts))
                        return "accounts: array expected";
                    for (let i = 0; i < message.accounts.length; ++i) {
                        let error = $root.bettercallsol.Transaction.Instruction.Account.verify(message.accounts[i]);
                        if (error)
                            return "accounts." + error;
                    }
                }
                if (message.anchorAccounts != null && message.hasOwnProperty("anchorAccounts")) {
                    if (!Array.isArray(message.anchorAccounts))
                        return "anchorAccounts: array expected";
                    for (let i = 0; i < message.anchorAccounts.length; ++i) {
                        let error = $root.bettercallsol.Transaction.Instruction.Account.verify(message.anchorAccounts[i]);
                        if (error)
                            return "anchorAccounts." + error;
                    }
                }
                if (message.data != null && message.hasOwnProperty("data")) {
                    properties._data = 1;
                    {
                        let error = $root.bettercallsol.Transaction.Instruction.Data.verify(message.data);
                        if (error)
                            return "data." + error;
                    }
                }
                return null;
            };

            /**
             * Creates an Instruction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof bettercallsol.Transaction.Instruction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {bettercallsol.Transaction.Instruction} Instruction
             */
            Instruction.fromObject = function fromObject(object) {
                if (object instanceof $root.bettercallsol.Transaction.Instruction)
                    return object;
                let message = new $root.bettercallsol.Transaction.Instruction();
                if (object.name != null)
                    message.name = String(object.name);
                if (object.description != null)
                    message.description = String(object.description);
                if (object.programId != null)
                    message.programId = String(object.programId);
                if (object.anchorMethod != null)
                    message.anchorMethod = String(object.anchorMethod);
                if (object.programMetadata != null) {
                    if (typeof object.programMetadata !== "object")
                        throw TypeError(".bettercallsol.Transaction.Instruction.programMetadata: object expected");
                    message.programMetadata = $root.bettercallsol.Transaction.Instruction.AccountMetadata.fromObject(object.programMetadata);
                }
                if (object.accounts) {
                    if (!Array.isArray(object.accounts))
                        throw TypeError(".bettercallsol.Transaction.Instruction.accounts: array expected");
                    message.accounts = [];
                    for (let i = 0; i < object.accounts.length; ++i) {
                        if (typeof object.accounts[i] !== "object")
                            throw TypeError(".bettercallsol.Transaction.Instruction.accounts: object expected");
                        message.accounts[i] = $root.bettercallsol.Transaction.Instruction.Account.fromObject(object.accounts[i]);
                    }
                }
                if (object.anchorAccounts) {
                    if (!Array.isArray(object.anchorAccounts))
                        throw TypeError(".bettercallsol.Transaction.Instruction.anchorAccounts: array expected");
                    message.anchorAccounts = [];
                    for (let i = 0; i < object.anchorAccounts.length; ++i) {
                        if (typeof object.anchorAccounts[i] !== "object")
                            throw TypeError(".bettercallsol.Transaction.Instruction.anchorAccounts: object expected");
                        message.anchorAccounts[i] = $root.bettercallsol.Transaction.Instruction.Account.fromObject(object.anchorAccounts[i]);
                    }
                }
                if (object.data != null) {
                    if (typeof object.data !== "object")
                        throw TypeError(".bettercallsol.Transaction.Instruction.data: object expected");
                    message.data = $root.bettercallsol.Transaction.Instruction.Data.fromObject(object.data);
                }
                return message;
            };

            /**
             * Creates a plain object from an Instruction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof bettercallsol.Transaction.Instruction
             * @static
             * @param {bettercallsol.Transaction.Instruction} message Instruction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Instruction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults) {
                    object.accounts = [];
                    object.anchorAccounts = [];
                }
                if (message.name != null && message.hasOwnProperty("name")) {
                    object.name = message.name;
                    if (options.oneofs)
                        object._name = "name";
                }
                if (message.description != null && message.hasOwnProperty("description")) {
                    object.description = message.description;
                    if (options.oneofs)
                        object._description = "description";
                }
                if (message.programId != null && message.hasOwnProperty("programId")) {
                    object.programId = message.programId;
                    if (options.oneofs)
                        object._programId = "programId";
                }
                if (message.anchorMethod != null && message.hasOwnProperty("anchorMethod")) {
                    object.anchorMethod = message.anchorMethod;
                    if (options.oneofs)
                        object._anchorMethod = "anchorMethod";
                }
                if (message.programMetadata != null && message.hasOwnProperty("programMetadata")) {
                    object.programMetadata = $root.bettercallsol.Transaction.Instruction.AccountMetadata.toObject(message.programMetadata, options);
                    if (options.oneofs)
                        object._programMetadata = "programMetadata";
                }
                if (message.accounts && message.accounts.length) {
                    object.accounts = [];
                    for (let j = 0; j < message.accounts.length; ++j)
                        object.accounts[j] = $root.bettercallsol.Transaction.Instruction.Account.toObject(message.accounts[j], options);
                }
                if (message.anchorAccounts && message.anchorAccounts.length) {
                    object.anchorAccounts = [];
                    for (let j = 0; j < message.anchorAccounts.length; ++j)
                        object.anchorAccounts[j] = $root.bettercallsol.Transaction.Instruction.Account.toObject(message.anchorAccounts[j], options);
                }
                if (message.data != null && message.hasOwnProperty("data")) {
                    object.data = $root.bettercallsol.Transaction.Instruction.Data.toObject(message.data, options);
                    if (options.oneofs)
                        object._data = "data";
                }
                return object;
            };

            /**
             * Converts this Instruction to JSON.
             * @function toJSON
             * @memberof bettercallsol.Transaction.Instruction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Instruction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Instruction
             * @function getTypeUrl
             * @memberof bettercallsol.Transaction.Instruction
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Instruction.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/bettercallsol.Transaction.Instruction";
            };

            Instruction.AccountMetadata = (function() {

                /**
                 * Properties of an AccountMetadata.
                 * @memberof bettercallsol.Transaction.Instruction
                 * @interface IAccountMetadata
                 * @property {string|null} [name] AccountMetadata name
                 * @property {string|null} [mint] AccountMetadata mint
                 * @property {Array.<google.protobuf.IValue>|null} [seeds] AccountMetadata seeds
                 * @property {number|null} [bump] AccountMetadata bump
                 */

                /**
                 * Constructs a new AccountMetadata.
                 * @memberof bettercallsol.Transaction.Instruction
                 * @classdesc Represents an AccountMetadata.
                 * @implements IAccountMetadata
                 * @constructor
                 * @param {bettercallsol.Transaction.Instruction.IAccountMetadata=} [properties] Properties to set
                 */
                function AccountMetadata(properties) {
                    this.seeds = [];
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * AccountMetadata name.
                 * @member {string|null|undefined} name
                 * @memberof bettercallsol.Transaction.Instruction.AccountMetadata
                 * @instance
                 */
                AccountMetadata.prototype.name = null;

                /**
                 * AccountMetadata mint.
                 * @member {string|null|undefined} mint
                 * @memberof bettercallsol.Transaction.Instruction.AccountMetadata
                 * @instance
                 */
                AccountMetadata.prototype.mint = null;

                /**
                 * AccountMetadata seeds.
                 * @member {Array.<google.protobuf.IValue>} seeds
                 * @memberof bettercallsol.Transaction.Instruction.AccountMetadata
                 * @instance
                 */
                AccountMetadata.prototype.seeds = $util.emptyArray;

                /**
                 * AccountMetadata bump.
                 * @member {number|null|undefined} bump
                 * @memberof bettercallsol.Transaction.Instruction.AccountMetadata
                 * @instance
                 */
                AccountMetadata.prototype.bump = null;

                // OneOf field names bound to virtual getters and setters
                let $oneOfFields;

                /**
                 * AccountMetadata _name.
                 * @member {"name"|undefined} _name
                 * @memberof bettercallsol.Transaction.Instruction.AccountMetadata
                 * @instance
                 */
                Object.defineProperty(AccountMetadata.prototype, "_name", {
                    get: $util.oneOfGetter($oneOfFields = ["name"]),
                    set: $util.oneOfSetter($oneOfFields)
                });

                /**
                 * AccountMetadata _mint.
                 * @member {"mint"|undefined} _mint
                 * @memberof bettercallsol.Transaction.Instruction.AccountMetadata
                 * @instance
                 */
                Object.defineProperty(AccountMetadata.prototype, "_mint", {
                    get: $util.oneOfGetter($oneOfFields = ["mint"]),
                    set: $util.oneOfSetter($oneOfFields)
                });

                /**
                 * AccountMetadata _bump.
                 * @member {"bump"|undefined} _bump
                 * @memberof bettercallsol.Transaction.Instruction.AccountMetadata
                 * @instance
                 */
                Object.defineProperty(AccountMetadata.prototype, "_bump", {
                    get: $util.oneOfGetter($oneOfFields = ["bump"]),
                    set: $util.oneOfSetter($oneOfFields)
                });

                /**
                 * Creates a new AccountMetadata instance using the specified properties.
                 * @function create
                 * @memberof bettercallsol.Transaction.Instruction.AccountMetadata
                 * @static
                 * @param {bettercallsol.Transaction.Instruction.IAccountMetadata=} [properties] Properties to set
                 * @returns {bettercallsol.Transaction.Instruction.AccountMetadata} AccountMetadata instance
                 */
                AccountMetadata.create = function create(properties) {
                    return new AccountMetadata(properties);
                };

                /**
                 * Encodes the specified AccountMetadata message. Does not implicitly {@link bettercallsol.Transaction.Instruction.AccountMetadata.verify|verify} messages.
                 * @function encode
                 * @memberof bettercallsol.Transaction.Instruction.AccountMetadata
                 * @static
                 * @param {bettercallsol.Transaction.Instruction.IAccountMetadata} message AccountMetadata message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                AccountMetadata.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
                    if (message.mint != null && Object.hasOwnProperty.call(message, "mint"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.mint);
                    if (message.seeds != null && message.seeds.length)
                        for (let i = 0; i < message.seeds.length; ++i)
                            $root.google.protobuf.Value.encode(message.seeds[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                    if (message.bump != null && Object.hasOwnProperty.call(message, "bump"))
                        writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.bump);
                    return writer;
                };

                /**
                 * Encodes the specified AccountMetadata message, length delimited. Does not implicitly {@link bettercallsol.Transaction.Instruction.AccountMetadata.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof bettercallsol.Transaction.Instruction.AccountMetadata
                 * @static
                 * @param {bettercallsol.Transaction.Instruction.IAccountMetadata} message AccountMetadata message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                AccountMetadata.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes an AccountMetadata message from the specified reader or buffer.
                 * @function decode
                 * @memberof bettercallsol.Transaction.Instruction.AccountMetadata
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {bettercallsol.Transaction.Instruction.AccountMetadata} AccountMetadata
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                AccountMetadata.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.bettercallsol.Transaction.Instruction.AccountMetadata();
                    while (reader.pos < end) {
                        let tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1: {
                                message.name = reader.string();
                                break;
                            }
                        case 2: {
                                message.mint = reader.string();
                                break;
                            }
                        case 3: {
                                if (!(message.seeds && message.seeds.length))
                                    message.seeds = [];
                                message.seeds.push($root.google.protobuf.Value.decode(reader, reader.uint32()));
                                break;
                            }
                        case 4: {
                                message.bump = reader.uint32();
                                break;
                            }
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes an AccountMetadata message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof bettercallsol.Transaction.Instruction.AccountMetadata
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {bettercallsol.Transaction.Instruction.AccountMetadata} AccountMetadata
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                AccountMetadata.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies an AccountMetadata message.
                 * @function verify
                 * @memberof bettercallsol.Transaction.Instruction.AccountMetadata
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                AccountMetadata.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    let properties = {};
                    if (message.name != null && message.hasOwnProperty("name")) {
                        properties._name = 1;
                        if (!$util.isString(message.name))
                            return "name: string expected";
                    }
                    if (message.mint != null && message.hasOwnProperty("mint")) {
                        properties._mint = 1;
                        if (!$util.isString(message.mint))
                            return "mint: string expected";
                    }
                    if (message.seeds != null && message.hasOwnProperty("seeds")) {
                        if (!Array.isArray(message.seeds))
                            return "seeds: array expected";
                        for (let i = 0; i < message.seeds.length; ++i) {
                            let error = $root.google.protobuf.Value.verify(message.seeds[i]);
                            if (error)
                                return "seeds." + error;
                        }
                    }
                    if (message.bump != null && message.hasOwnProperty("bump")) {
                        properties._bump = 1;
                        if (!$util.isInteger(message.bump))
                            return "bump: integer expected";
                    }
                    return null;
                };

                /**
                 * Creates an AccountMetadata message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof bettercallsol.Transaction.Instruction.AccountMetadata
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {bettercallsol.Transaction.Instruction.AccountMetadata} AccountMetadata
                 */
                AccountMetadata.fromObject = function fromObject(object) {
                    if (object instanceof $root.bettercallsol.Transaction.Instruction.AccountMetadata)
                        return object;
                    let message = new $root.bettercallsol.Transaction.Instruction.AccountMetadata();
                    if (object.name != null)
                        message.name = String(object.name);
                    if (object.mint != null)
                        message.mint = String(object.mint);
                    if (object.seeds) {
                        if (!Array.isArray(object.seeds))
                            throw TypeError(".bettercallsol.Transaction.Instruction.AccountMetadata.seeds: array expected");
                        message.seeds = [];
                        for (let i = 0; i < object.seeds.length; ++i) {
                            if (typeof object.seeds[i] !== "object")
                                throw TypeError(".bettercallsol.Transaction.Instruction.AccountMetadata.seeds: object expected");
                            message.seeds[i] = $root.google.protobuf.Value.fromObject(object.seeds[i]);
                        }
                    }
                    if (object.bump != null)
                        message.bump = object.bump >>> 0;
                    return message;
                };

                /**
                 * Creates a plain object from an AccountMetadata message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof bettercallsol.Transaction.Instruction.AccountMetadata
                 * @static
                 * @param {bettercallsol.Transaction.Instruction.AccountMetadata} message AccountMetadata
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                AccountMetadata.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    let object = {};
                    if (options.arrays || options.defaults)
                        object.seeds = [];
                    if (message.name != null && message.hasOwnProperty("name")) {
                        object.name = message.name;
                        if (options.oneofs)
                            object._name = "name";
                    }
                    if (message.mint != null && message.hasOwnProperty("mint")) {
                        object.mint = message.mint;
                        if (options.oneofs)
                            object._mint = "mint";
                    }
                    if (message.seeds && message.seeds.length) {
                        object.seeds = [];
                        for (let j = 0; j < message.seeds.length; ++j)
                            object.seeds[j] = $root.google.protobuf.Value.toObject(message.seeds[j], options);
                    }
                    if (message.bump != null && message.hasOwnProperty("bump")) {
                        object.bump = message.bump;
                        if (options.oneofs)
                            object._bump = "bump";
                    }
                    return object;
                };

                /**
                 * Converts this AccountMetadata to JSON.
                 * @function toJSON
                 * @memberof bettercallsol.Transaction.Instruction.AccountMetadata
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                AccountMetadata.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for AccountMetadata
                 * @function getTypeUrl
                 * @memberof bettercallsol.Transaction.Instruction.AccountMetadata
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                AccountMetadata.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/bettercallsol.Transaction.Instruction.AccountMetadata";
                };

                return AccountMetadata;
            })();

            Instruction.Account = (function() {

                /**
                 * Properties of an Account.
                 * @memberof bettercallsol.Transaction.Instruction
                 * @interface IAccount
                 * @property {string|null} [name] Account name
                 * @property {string|null} [description] Account description
                 * @property {bettercallsol.Transaction.Instruction.Account.AccountType|null} [type] Account type
                 * @property {string|null} [pubkey] Account pubkey
                 * @property {boolean|null} [isWritable] Account isWritable
                 * @property {boolean|null} [isSigner] Account isSigner
                 * @property {bettercallsol.Transaction.Instruction.IAccountMetadata|null} [metadata] Account metadata
                 */

                /**
                 * Constructs a new Account.
                 * @memberof bettercallsol.Transaction.Instruction
                 * @classdesc Represents an Account.
                 * @implements IAccount
                 * @constructor
                 * @param {bettercallsol.Transaction.Instruction.IAccount=} [properties] Properties to set
                 */
                function Account(properties) {
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Account name.
                 * @member {string|null|undefined} name
                 * @memberof bettercallsol.Transaction.Instruction.Account
                 * @instance
                 */
                Account.prototype.name = null;

                /**
                 * Account description.
                 * @member {string|null|undefined} description
                 * @memberof bettercallsol.Transaction.Instruction.Account
                 * @instance
                 */
                Account.prototype.description = null;

                /**
                 * Account type.
                 * @member {bettercallsol.Transaction.Instruction.Account.AccountType} type
                 * @memberof bettercallsol.Transaction.Instruction.Account
                 * @instance
                 */
                Account.prototype.type = 0;

                /**
                 * Account pubkey.
                 * @member {string|null|undefined} pubkey
                 * @memberof bettercallsol.Transaction.Instruction.Account
                 * @instance
                 */
                Account.prototype.pubkey = null;

                /**
                 * Account isWritable.
                 * @member {boolean} isWritable
                 * @memberof bettercallsol.Transaction.Instruction.Account
                 * @instance
                 */
                Account.prototype.isWritable = false;

                /**
                 * Account isSigner.
                 * @member {boolean} isSigner
                 * @memberof bettercallsol.Transaction.Instruction.Account
                 * @instance
                 */
                Account.prototype.isSigner = false;

                /**
                 * Account metadata.
                 * @member {bettercallsol.Transaction.Instruction.IAccountMetadata|null|undefined} metadata
                 * @memberof bettercallsol.Transaction.Instruction.Account
                 * @instance
                 */
                Account.prototype.metadata = null;

                // OneOf field names bound to virtual getters and setters
                let $oneOfFields;

                /**
                 * Account _name.
                 * @member {"name"|undefined} _name
                 * @memberof bettercallsol.Transaction.Instruction.Account
                 * @instance
                 */
                Object.defineProperty(Account.prototype, "_name", {
                    get: $util.oneOfGetter($oneOfFields = ["name"]),
                    set: $util.oneOfSetter($oneOfFields)
                });

                /**
                 * Account _description.
                 * @member {"description"|undefined} _description
                 * @memberof bettercallsol.Transaction.Instruction.Account
                 * @instance
                 */
                Object.defineProperty(Account.prototype, "_description", {
                    get: $util.oneOfGetter($oneOfFields = ["description"]),
                    set: $util.oneOfSetter($oneOfFields)
                });

                /**
                 * Account _pubkey.
                 * @member {"pubkey"|undefined} _pubkey
                 * @memberof bettercallsol.Transaction.Instruction.Account
                 * @instance
                 */
                Object.defineProperty(Account.prototype, "_pubkey", {
                    get: $util.oneOfGetter($oneOfFields = ["pubkey"]),
                    set: $util.oneOfSetter($oneOfFields)
                });

                /**
                 * Account _metadata.
                 * @member {"metadata"|undefined} _metadata
                 * @memberof bettercallsol.Transaction.Instruction.Account
                 * @instance
                 */
                Object.defineProperty(Account.prototype, "_metadata", {
                    get: $util.oneOfGetter($oneOfFields = ["metadata"]),
                    set: $util.oneOfSetter($oneOfFields)
                });

                /**
                 * Creates a new Account instance using the specified properties.
                 * @function create
                 * @memberof bettercallsol.Transaction.Instruction.Account
                 * @static
                 * @param {bettercallsol.Transaction.Instruction.IAccount=} [properties] Properties to set
                 * @returns {bettercallsol.Transaction.Instruction.Account} Account instance
                 */
                Account.create = function create(properties) {
                    return new Account(properties);
                };

                /**
                 * Encodes the specified Account message. Does not implicitly {@link bettercallsol.Transaction.Instruction.Account.verify|verify} messages.
                 * @function encode
                 * @memberof bettercallsol.Transaction.Instruction.Account
                 * @static
                 * @param {bettercallsol.Transaction.Instruction.IAccount} message Account message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Account.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
                    if (message.description != null && Object.hasOwnProperty.call(message, "description"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.description);
                    if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                        writer.uint32(/* id 3, wireType 0 =*/24).int32(message.type);
                    if (message.pubkey != null && Object.hasOwnProperty.call(message, "pubkey"))
                        writer.uint32(/* id 4, wireType 2 =*/34).string(message.pubkey);
                    if (message.isWritable != null && Object.hasOwnProperty.call(message, "isWritable"))
                        writer.uint32(/* id 5, wireType 0 =*/40).bool(message.isWritable);
                    if (message.isSigner != null && Object.hasOwnProperty.call(message, "isSigner"))
                        writer.uint32(/* id 6, wireType 0 =*/48).bool(message.isSigner);
                    if (message.metadata != null && Object.hasOwnProperty.call(message, "metadata"))
                        $root.bettercallsol.Transaction.Instruction.AccountMetadata.encode(message.metadata, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified Account message, length delimited. Does not implicitly {@link bettercallsol.Transaction.Instruction.Account.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof bettercallsol.Transaction.Instruction.Account
                 * @static
                 * @param {bettercallsol.Transaction.Instruction.IAccount} message Account message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Account.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes an Account message from the specified reader or buffer.
                 * @function decode
                 * @memberof bettercallsol.Transaction.Instruction.Account
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {bettercallsol.Transaction.Instruction.Account} Account
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Account.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.bettercallsol.Transaction.Instruction.Account();
                    while (reader.pos < end) {
                        let tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1: {
                                message.name = reader.string();
                                break;
                            }
                        case 2: {
                                message.description = reader.string();
                                break;
                            }
                        case 3: {
                                message.type = reader.int32();
                                break;
                            }
                        case 4: {
                                message.pubkey = reader.string();
                                break;
                            }
                        case 5: {
                                message.isWritable = reader.bool();
                                break;
                            }
                        case 6: {
                                message.isSigner = reader.bool();
                                break;
                            }
                        case 7: {
                                message.metadata = $root.bettercallsol.Transaction.Instruction.AccountMetadata.decode(reader, reader.uint32());
                                break;
                            }
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes an Account message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof bettercallsol.Transaction.Instruction.Account
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {bettercallsol.Transaction.Instruction.Account} Account
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Account.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies an Account message.
                 * @function verify
                 * @memberof bettercallsol.Transaction.Instruction.Account
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Account.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    let properties = {};
                    if (message.name != null && message.hasOwnProperty("name")) {
                        properties._name = 1;
                        if (!$util.isString(message.name))
                            return "name: string expected";
                    }
                    if (message.description != null && message.hasOwnProperty("description")) {
                        properties._description = 1;
                        if (!$util.isString(message.description))
                            return "description: string expected";
                    }
                    if (message.type != null && message.hasOwnProperty("type"))
                        switch (message.type) {
                        default:
                            return "type: enum value expected";
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                        case 5:
                        case 6:
                            break;
                        }
                    if (message.pubkey != null && message.hasOwnProperty("pubkey")) {
                        properties._pubkey = 1;
                        if (!$util.isString(message.pubkey))
                            return "pubkey: string expected";
                    }
                    if (message.isWritable != null && message.hasOwnProperty("isWritable"))
                        if (typeof message.isWritable !== "boolean")
                            return "isWritable: boolean expected";
                    if (message.isSigner != null && message.hasOwnProperty("isSigner"))
                        if (typeof message.isSigner !== "boolean")
                            return "isSigner: boolean expected";
                    if (message.metadata != null && message.hasOwnProperty("metadata")) {
                        properties._metadata = 1;
                        {
                            let error = $root.bettercallsol.Transaction.Instruction.AccountMetadata.verify(message.metadata);
                            if (error)
                                return "metadata." + error;
                        }
                    }
                    return null;
                };

                /**
                 * Creates an Account message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof bettercallsol.Transaction.Instruction.Account
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {bettercallsol.Transaction.Instruction.Account} Account
                 */
                Account.fromObject = function fromObject(object) {
                    if (object instanceof $root.bettercallsol.Transaction.Instruction.Account)
                        return object;
                    let message = new $root.bettercallsol.Transaction.Instruction.Account();
                    if (object.name != null)
                        message.name = String(object.name);
                    if (object.description != null)
                        message.description = String(object.description);
                    switch (object.type) {
                    default:
                        if (typeof object.type === "number") {
                            message.type = object.type;
                            break;
                        }
                        break;
                    case "UNSPECIFIED":
                    case 0:
                        message.type = 0;
                        break;
                    case "WALLET":
                    case 1:
                        message.type = 1;
                        break;
                    case "KEYPAIR":
                    case 2:
                        message.type = 2;
                        break;
                    case "PROGRAM":
                    case 3:
                        message.type = 3;
                        break;
                    case "SYSVAR":
                    case 4:
                        message.type = 4;
                        break;
                    case "PDA":
                    case 5:
                        message.type = 5;
                        break;
                    case "ATA":
                    case 6:
                        message.type = 6;
                        break;
                    }
                    if (object.pubkey != null)
                        message.pubkey = String(object.pubkey);
                    if (object.isWritable != null)
                        message.isWritable = Boolean(object.isWritable);
                    if (object.isSigner != null)
                        message.isSigner = Boolean(object.isSigner);
                    if (object.metadata != null) {
                        if (typeof object.metadata !== "object")
                            throw TypeError(".bettercallsol.Transaction.Instruction.Account.metadata: object expected");
                        message.metadata = $root.bettercallsol.Transaction.Instruction.AccountMetadata.fromObject(object.metadata);
                    }
                    return message;
                };

                /**
                 * Creates a plain object from an Account message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof bettercallsol.Transaction.Instruction.Account
                 * @static
                 * @param {bettercallsol.Transaction.Instruction.Account} message Account
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Account.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    let object = {};
                    if (options.defaults) {
                        object.type = options.enums === String ? "UNSPECIFIED" : 0;
                        object.isWritable = false;
                        object.isSigner = false;
                    }
                    if (message.name != null && message.hasOwnProperty("name")) {
                        object.name = message.name;
                        if (options.oneofs)
                            object._name = "name";
                    }
                    if (message.description != null && message.hasOwnProperty("description")) {
                        object.description = message.description;
                        if (options.oneofs)
                            object._description = "description";
                    }
                    if (message.type != null && message.hasOwnProperty("type"))
                        object.type = options.enums === String ? $root.bettercallsol.Transaction.Instruction.Account.AccountType[message.type] === undefined ? message.type : $root.bettercallsol.Transaction.Instruction.Account.AccountType[message.type] : message.type;
                    if (message.pubkey != null && message.hasOwnProperty("pubkey")) {
                        object.pubkey = message.pubkey;
                        if (options.oneofs)
                            object._pubkey = "pubkey";
                    }
                    if (message.isWritable != null && message.hasOwnProperty("isWritable"))
                        object.isWritable = message.isWritable;
                    if (message.isSigner != null && message.hasOwnProperty("isSigner"))
                        object.isSigner = message.isSigner;
                    if (message.metadata != null && message.hasOwnProperty("metadata")) {
                        object.metadata = $root.bettercallsol.Transaction.Instruction.AccountMetadata.toObject(message.metadata, options);
                        if (options.oneofs)
                            object._metadata = "metadata";
                    }
                    return object;
                };

                /**
                 * Converts this Account to JSON.
                 * @function toJSON
                 * @memberof bettercallsol.Transaction.Instruction.Account
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Account.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for Account
                 * @function getTypeUrl
                 * @memberof bettercallsol.Transaction.Instruction.Account
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                Account.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/bettercallsol.Transaction.Instruction.Account";
                };

                /**
                 * AccountType enum.
                 * @name bettercallsol.Transaction.Instruction.Account.AccountType
                 * @enum {number}
                 * @property {number} UNSPECIFIED=0 UNSPECIFIED value
                 * @property {number} WALLET=1 WALLET value
                 * @property {number} KEYPAIR=2 KEYPAIR value
                 * @property {number} PROGRAM=3 PROGRAM value
                 * @property {number} SYSVAR=4 SYSVAR value
                 * @property {number} PDA=5 PDA value
                 * @property {number} ATA=6 ATA value
                 */
                Account.AccountType = (function() {
                    const valuesById = {}, values = Object.create(valuesById);
                    values[valuesById[0] = "UNSPECIFIED"] = 0;
                    values[valuesById[1] = "WALLET"] = 1;
                    values[valuesById[2] = "KEYPAIR"] = 2;
                    values[valuesById[3] = "PROGRAM"] = 3;
                    values[valuesById[4] = "SYSVAR"] = 4;
                    values[valuesById[5] = "PDA"] = 5;
                    values[valuesById[6] = "ATA"] = 6;
                    return values;
                })();

                return Account;
            })();

            Instruction.Data = (function() {

                /**
                 * Properties of a Data.
                 * @memberof bettercallsol.Transaction.Instruction
                 * @interface IData
                 * @property {bettercallsol.Transaction.Instruction.Data.DataFormat|null} [format] Data format
                 * @property {bettercallsol.Transaction.Instruction.Data.IDataRaw|null} [rawValue] Data rawValue
                 * @property {Array.<bettercallsol.Transaction.Instruction.Data.IDataField>|null} [fieldValue] Data fieldValue
                 */

                /**
                 * Constructs a new Data.
                 * @memberof bettercallsol.Transaction.Instruction
                 * @classdesc Represents a Data.
                 * @implements IData
                 * @constructor
                 * @param {bettercallsol.Transaction.Instruction.IData=} [properties] Properties to set
                 */
                function Data(properties) {
                    this.fieldValue = [];
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Data format.
                 * @member {bettercallsol.Transaction.Instruction.Data.DataFormat} format
                 * @memberof bettercallsol.Transaction.Instruction.Data
                 * @instance
                 */
                Data.prototype.format = 0;

                /**
                 * Data rawValue.
                 * @member {bettercallsol.Transaction.Instruction.Data.IDataRaw|null|undefined} rawValue
                 * @memberof bettercallsol.Transaction.Instruction.Data
                 * @instance
                 */
                Data.prototype.rawValue = null;

                /**
                 * Data fieldValue.
                 * @member {Array.<bettercallsol.Transaction.Instruction.Data.IDataField>} fieldValue
                 * @memberof bettercallsol.Transaction.Instruction.Data
                 * @instance
                 */
                Data.prototype.fieldValue = $util.emptyArray;

                // OneOf field names bound to virtual getters and setters
                let $oneOfFields;

                /**
                 * Data _rawValue.
                 * @member {"rawValue"|undefined} _rawValue
                 * @memberof bettercallsol.Transaction.Instruction.Data
                 * @instance
                 */
                Object.defineProperty(Data.prototype, "_rawValue", {
                    get: $util.oneOfGetter($oneOfFields = ["rawValue"]),
                    set: $util.oneOfSetter($oneOfFields)
                });

                /**
                 * Creates a new Data instance using the specified properties.
                 * @function create
                 * @memberof bettercallsol.Transaction.Instruction.Data
                 * @static
                 * @param {bettercallsol.Transaction.Instruction.IData=} [properties] Properties to set
                 * @returns {bettercallsol.Transaction.Instruction.Data} Data instance
                 */
                Data.create = function create(properties) {
                    return new Data(properties);
                };

                /**
                 * Encodes the specified Data message. Does not implicitly {@link bettercallsol.Transaction.Instruction.Data.verify|verify} messages.
                 * @function encode
                 * @memberof bettercallsol.Transaction.Instruction.Data
                 * @static
                 * @param {bettercallsol.Transaction.Instruction.IData} message Data message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Data.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.format != null && Object.hasOwnProperty.call(message, "format"))
                        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.format);
                    if (message.rawValue != null && Object.hasOwnProperty.call(message, "rawValue"))
                        $root.bettercallsol.Transaction.Instruction.Data.DataRaw.encode(message.rawValue, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                    if (message.fieldValue != null && message.fieldValue.length)
                        for (let i = 0; i < message.fieldValue.length; ++i)
                            $root.bettercallsol.Transaction.Instruction.Data.DataField.encode(message.fieldValue[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified Data message, length delimited. Does not implicitly {@link bettercallsol.Transaction.Instruction.Data.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof bettercallsol.Transaction.Instruction.Data
                 * @static
                 * @param {bettercallsol.Transaction.Instruction.IData} message Data message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Data.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a Data message from the specified reader or buffer.
                 * @function decode
                 * @memberof bettercallsol.Transaction.Instruction.Data
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {bettercallsol.Transaction.Instruction.Data} Data
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Data.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.bettercallsol.Transaction.Instruction.Data();
                    while (reader.pos < end) {
                        let tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1: {
                                message.format = reader.int32();
                                break;
                            }
                        case 2: {
                                message.rawValue = $root.bettercallsol.Transaction.Instruction.Data.DataRaw.decode(reader, reader.uint32());
                                break;
                            }
                        case 3: {
                                if (!(message.fieldValue && message.fieldValue.length))
                                    message.fieldValue = [];
                                message.fieldValue.push($root.bettercallsol.Transaction.Instruction.Data.DataField.decode(reader, reader.uint32()));
                                break;
                            }
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a Data message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof bettercallsol.Transaction.Instruction.Data
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {bettercallsol.Transaction.Instruction.Data} Data
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Data.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Data message.
                 * @function verify
                 * @memberof bettercallsol.Transaction.Instruction.Data
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Data.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    let properties = {};
                    if (message.format != null && message.hasOwnProperty("format"))
                        switch (message.format) {
                        default:
                            return "format: enum value expected";
                        case 0:
                        case 1:
                        case 2:
                            break;
                        }
                    if (message.rawValue != null && message.hasOwnProperty("rawValue")) {
                        properties._rawValue = 1;
                        {
                            let error = $root.bettercallsol.Transaction.Instruction.Data.DataRaw.verify(message.rawValue);
                            if (error)
                                return "rawValue." + error;
                        }
                    }
                    if (message.fieldValue != null && message.hasOwnProperty("fieldValue")) {
                        if (!Array.isArray(message.fieldValue))
                            return "fieldValue: array expected";
                        for (let i = 0; i < message.fieldValue.length; ++i) {
                            let error = $root.bettercallsol.Transaction.Instruction.Data.DataField.verify(message.fieldValue[i]);
                            if (error)
                                return "fieldValue." + error;
                        }
                    }
                    return null;
                };

                /**
                 * Creates a Data message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof bettercallsol.Transaction.Instruction.Data
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {bettercallsol.Transaction.Instruction.Data} Data
                 */
                Data.fromObject = function fromObject(object) {
                    if (object instanceof $root.bettercallsol.Transaction.Instruction.Data)
                        return object;
                    let message = new $root.bettercallsol.Transaction.Instruction.Data();
                    switch (object.format) {
                    default:
                        if (typeof object.format === "number") {
                            message.format = object.format;
                            break;
                        }
                        break;
                    case "RAW":
                    case 0:
                        message.format = 0;
                        break;
                    case "BUFFER_LAYOUT":
                    case 1:
                        message.format = 1;
                        break;
                    case "BORSH":
                    case 2:
                        message.format = 2;
                        break;
                    }
                    if (object.rawValue != null) {
                        if (typeof object.rawValue !== "object")
                            throw TypeError(".bettercallsol.Transaction.Instruction.Data.rawValue: object expected");
                        message.rawValue = $root.bettercallsol.Transaction.Instruction.Data.DataRaw.fromObject(object.rawValue);
                    }
                    if (object.fieldValue) {
                        if (!Array.isArray(object.fieldValue))
                            throw TypeError(".bettercallsol.Transaction.Instruction.Data.fieldValue: array expected");
                        message.fieldValue = [];
                        for (let i = 0; i < object.fieldValue.length; ++i) {
                            if (typeof object.fieldValue[i] !== "object")
                                throw TypeError(".bettercallsol.Transaction.Instruction.Data.fieldValue: object expected");
                            message.fieldValue[i] = $root.bettercallsol.Transaction.Instruction.Data.DataField.fromObject(object.fieldValue[i]);
                        }
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a Data message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof bettercallsol.Transaction.Instruction.Data
                 * @static
                 * @param {bettercallsol.Transaction.Instruction.Data} message Data
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Data.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    let object = {};
                    if (options.arrays || options.defaults)
                        object.fieldValue = [];
                    if (options.defaults)
                        object.format = options.enums === String ? "RAW" : 0;
                    if (message.format != null && message.hasOwnProperty("format"))
                        object.format = options.enums === String ? $root.bettercallsol.Transaction.Instruction.Data.DataFormat[message.format] === undefined ? message.format : $root.bettercallsol.Transaction.Instruction.Data.DataFormat[message.format] : message.format;
                    if (message.rawValue != null && message.hasOwnProperty("rawValue")) {
                        object.rawValue = $root.bettercallsol.Transaction.Instruction.Data.DataRaw.toObject(message.rawValue, options);
                        if (options.oneofs)
                            object._rawValue = "rawValue";
                    }
                    if (message.fieldValue && message.fieldValue.length) {
                        object.fieldValue = [];
                        for (let j = 0; j < message.fieldValue.length; ++j)
                            object.fieldValue[j] = $root.bettercallsol.Transaction.Instruction.Data.DataField.toObject(message.fieldValue[j], options);
                    }
                    return object;
                };

                /**
                 * Converts this Data to JSON.
                 * @function toJSON
                 * @memberof bettercallsol.Transaction.Instruction.Data
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Data.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for Data
                 * @function getTypeUrl
                 * @memberof bettercallsol.Transaction.Instruction.Data
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                Data.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/bettercallsol.Transaction.Instruction.Data";
                };

                /**
                 * DataFormat enum.
                 * @name bettercallsol.Transaction.Instruction.Data.DataFormat
                 * @enum {number}
                 * @property {number} RAW=0 RAW value
                 * @property {number} BUFFER_LAYOUT=1 BUFFER_LAYOUT value
                 * @property {number} BORSH=2 BORSH value
                 */
                Data.DataFormat = (function() {
                    const valuesById = {}, values = Object.create(valuesById);
                    values[valuesById[0] = "RAW"] = 0;
                    values[valuesById[1] = "BUFFER_LAYOUT"] = 1;
                    values[valuesById[2] = "BORSH"] = 2;
                    return values;
                })();

                Data.DataRaw = (function() {

                    /**
                     * Properties of a DataRaw.
                     * @memberof bettercallsol.Transaction.Instruction.Data
                     * @interface IDataRaw
                     * @property {string|null} [content] DataRaw content
                     * @property {bettercallsol.Transaction.Instruction.Data.DataRaw.Encoding|null} [encoding] DataRaw encoding
                     * @property {string|null} [description] DataRaw description
                     */

                    /**
                     * Constructs a new DataRaw.
                     * @memberof bettercallsol.Transaction.Instruction.Data
                     * @classdesc Represents a DataRaw.
                     * @implements IDataRaw
                     * @constructor
                     * @param {bettercallsol.Transaction.Instruction.Data.IDataRaw=} [properties] Properties to set
                     */
                    function DataRaw(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * DataRaw content.
                     * @member {string} content
                     * @memberof bettercallsol.Transaction.Instruction.Data.DataRaw
                     * @instance
                     */
                    DataRaw.prototype.content = "";

                    /**
                     * DataRaw encoding.
                     * @member {bettercallsol.Transaction.Instruction.Data.DataRaw.Encoding} encoding
                     * @memberof bettercallsol.Transaction.Instruction.Data.DataRaw
                     * @instance
                     */
                    DataRaw.prototype.encoding = 0;

                    /**
                     * DataRaw description.
                     * @member {string|null|undefined} description
                     * @memberof bettercallsol.Transaction.Instruction.Data.DataRaw
                     * @instance
                     */
                    DataRaw.prototype.description = null;

                    // OneOf field names bound to virtual getters and setters
                    let $oneOfFields;

                    /**
                     * DataRaw _description.
                     * @member {"description"|undefined} _description
                     * @memberof bettercallsol.Transaction.Instruction.Data.DataRaw
                     * @instance
                     */
                    Object.defineProperty(DataRaw.prototype, "_description", {
                        get: $util.oneOfGetter($oneOfFields = ["description"]),
                        set: $util.oneOfSetter($oneOfFields)
                    });

                    /**
                     * Creates a new DataRaw instance using the specified properties.
                     * @function create
                     * @memberof bettercallsol.Transaction.Instruction.Data.DataRaw
                     * @static
                     * @param {bettercallsol.Transaction.Instruction.Data.IDataRaw=} [properties] Properties to set
                     * @returns {bettercallsol.Transaction.Instruction.Data.DataRaw} DataRaw instance
                     */
                    DataRaw.create = function create(properties) {
                        return new DataRaw(properties);
                    };

                    /**
                     * Encodes the specified DataRaw message. Does not implicitly {@link bettercallsol.Transaction.Instruction.Data.DataRaw.verify|verify} messages.
                     * @function encode
                     * @memberof bettercallsol.Transaction.Instruction.Data.DataRaw
                     * @static
                     * @param {bettercallsol.Transaction.Instruction.Data.IDataRaw} message DataRaw message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    DataRaw.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.content != null && Object.hasOwnProperty.call(message, "content"))
                            writer.uint32(/* id 0, wireType 2 =*/2).string(message.content);
                        if (message.encoding != null && Object.hasOwnProperty.call(message, "encoding"))
                            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.encoding);
                        if (message.description != null && Object.hasOwnProperty.call(message, "description"))
                            writer.uint32(/* id 2, wireType 2 =*/18).string(message.description);
                        return writer;
                    };

                    /**
                     * Encodes the specified DataRaw message, length delimited. Does not implicitly {@link bettercallsol.Transaction.Instruction.Data.DataRaw.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof bettercallsol.Transaction.Instruction.Data.DataRaw
                     * @static
                     * @param {bettercallsol.Transaction.Instruction.Data.IDataRaw} message DataRaw message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    DataRaw.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a DataRaw message from the specified reader or buffer.
                     * @function decode
                     * @memberof bettercallsol.Transaction.Instruction.Data.DataRaw
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {bettercallsol.Transaction.Instruction.Data.DataRaw} DataRaw
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    DataRaw.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.bettercallsol.Transaction.Instruction.Data.DataRaw();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 0: {
                                    message.content = reader.string();
                                    break;
                                }
                            case 1: {
                                    message.encoding = reader.int32();
                                    break;
                                }
                            case 2: {
                                    message.description = reader.string();
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a DataRaw message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof bettercallsol.Transaction.Instruction.Data.DataRaw
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {bettercallsol.Transaction.Instruction.Data.DataRaw} DataRaw
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    DataRaw.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a DataRaw message.
                     * @function verify
                     * @memberof bettercallsol.Transaction.Instruction.Data.DataRaw
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    DataRaw.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        let properties = {};
                        if (message.content != null && message.hasOwnProperty("content"))
                            if (!$util.isString(message.content))
                                return "content: string expected";
                        if (message.encoding != null && message.hasOwnProperty("encoding"))
                            switch (message.encoding) {
                            default:
                                return "encoding: enum value expected";
                            case 0:
                            case 1:
                                break;
                            }
                        if (message.description != null && message.hasOwnProperty("description")) {
                            properties._description = 1;
                            if (!$util.isString(message.description))
                                return "description: string expected";
                        }
                        return null;
                    };

                    /**
                     * Creates a DataRaw message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof bettercallsol.Transaction.Instruction.Data.DataRaw
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {bettercallsol.Transaction.Instruction.Data.DataRaw} DataRaw
                     */
                    DataRaw.fromObject = function fromObject(object) {
                        if (object instanceof $root.bettercallsol.Transaction.Instruction.Data.DataRaw)
                            return object;
                        let message = new $root.bettercallsol.Transaction.Instruction.Data.DataRaw();
                        if (object.content != null)
                            message.content = String(object.content);
                        switch (object.encoding) {
                        default:
                            if (typeof object.encoding === "number") {
                                message.encoding = object.encoding;
                                break;
                            }
                            break;
                        case "HEX":
                        case 0:
                            message.encoding = 0;
                            break;
                        case "BS58":
                        case 1:
                            message.encoding = 1;
                            break;
                        }
                        if (object.description != null)
                            message.description = String(object.description);
                        return message;
                    };

                    /**
                     * Creates a plain object from a DataRaw message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof bettercallsol.Transaction.Instruction.Data.DataRaw
                     * @static
                     * @param {bettercallsol.Transaction.Instruction.Data.DataRaw} message DataRaw
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    DataRaw.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.defaults) {
                            object.content = "";
                            object.encoding = options.enums === String ? "HEX" : 0;
                        }
                        if (message.content != null && message.hasOwnProperty("content"))
                            object.content = message.content;
                        if (message.encoding != null && message.hasOwnProperty("encoding"))
                            object.encoding = options.enums === String ? $root.bettercallsol.Transaction.Instruction.Data.DataRaw.Encoding[message.encoding] === undefined ? message.encoding : $root.bettercallsol.Transaction.Instruction.Data.DataRaw.Encoding[message.encoding] : message.encoding;
                        if (message.description != null && message.hasOwnProperty("description")) {
                            object.description = message.description;
                            if (options.oneofs)
                                object._description = "description";
                        }
                        return object;
                    };

                    /**
                     * Converts this DataRaw to JSON.
                     * @function toJSON
                     * @memberof bettercallsol.Transaction.Instruction.Data.DataRaw
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    DataRaw.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    /**
                     * Gets the default type url for DataRaw
                     * @function getTypeUrl
                     * @memberof bettercallsol.Transaction.Instruction.Data.DataRaw
                     * @static
                     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns {string} The default type url
                     */
                    DataRaw.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                        if (typeUrlPrefix === undefined) {
                            typeUrlPrefix = "type.googleapis.com";
                        }
                        return typeUrlPrefix + "/bettercallsol.Transaction.Instruction.Data.DataRaw";
                    };

                    /**
                     * Encoding enum.
                     * @name bettercallsol.Transaction.Instruction.Data.DataRaw.Encoding
                     * @enum {number}
                     * @property {number} HEX=0 HEX value
                     * @property {number} BS58=1 BS58 value
                     */
                    DataRaw.Encoding = (function() {
                        const valuesById = {}, values = Object.create(valuesById);
                        values[valuesById[0] = "HEX"] = 0;
                        values[valuesById[1] = "BS58"] = 1;
                        return values;
                    })();

                    return DataRaw;
                })();

                Data.DataField = (function() {

                    /**
                     * Properties of a DataField.
                     * @memberof bettercallsol.Transaction.Instruction.Data
                     * @interface IDataField
                     * @property {string|null} [name] DataField name
                     * @property {string|null} [description] DataField description
                     * @property {bettercallsol.Transaction.Instruction.Data.DataField.DataFieldType|null} [type] DataField type
                     * @property {google.protobuf.IValue|null} [value] DataField value
                     */

                    /**
                     * Constructs a new DataField.
                     * @memberof bettercallsol.Transaction.Instruction.Data
                     * @classdesc Represents a DataField.
                     * @implements IDataField
                     * @constructor
                     * @param {bettercallsol.Transaction.Instruction.Data.IDataField=} [properties] Properties to set
                     */
                    function DataField(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * DataField name.
                     * @member {string|null|undefined} name
                     * @memberof bettercallsol.Transaction.Instruction.Data.DataField
                     * @instance
                     */
                    DataField.prototype.name = null;

                    /**
                     * DataField description.
                     * @member {string|null|undefined} description
                     * @memberof bettercallsol.Transaction.Instruction.Data.DataField
                     * @instance
                     */
                    DataField.prototype.description = null;

                    /**
                     * DataField type.
                     * @member {bettercallsol.Transaction.Instruction.Data.DataField.DataFieldType} type
                     * @memberof bettercallsol.Transaction.Instruction.Data.DataField
                     * @instance
                     */
                    DataField.prototype.type = 0;

                    /**
                     * DataField value.
                     * @member {google.protobuf.IValue|null|undefined} value
                     * @memberof bettercallsol.Transaction.Instruction.Data.DataField
                     * @instance
                     */
                    DataField.prototype.value = null;

                    // OneOf field names bound to virtual getters and setters
                    let $oneOfFields;

                    /**
                     * DataField _name.
                     * @member {"name"|undefined} _name
                     * @memberof bettercallsol.Transaction.Instruction.Data.DataField
                     * @instance
                     */
                    Object.defineProperty(DataField.prototype, "_name", {
                        get: $util.oneOfGetter($oneOfFields = ["name"]),
                        set: $util.oneOfSetter($oneOfFields)
                    });

                    /**
                     * DataField _description.
                     * @member {"description"|undefined} _description
                     * @memberof bettercallsol.Transaction.Instruction.Data.DataField
                     * @instance
                     */
                    Object.defineProperty(DataField.prototype, "_description", {
                        get: $util.oneOfGetter($oneOfFields = ["description"]),
                        set: $util.oneOfSetter($oneOfFields)
                    });

                    /**
                     * Creates a new DataField instance using the specified properties.
                     * @function create
                     * @memberof bettercallsol.Transaction.Instruction.Data.DataField
                     * @static
                     * @param {bettercallsol.Transaction.Instruction.Data.IDataField=} [properties] Properties to set
                     * @returns {bettercallsol.Transaction.Instruction.Data.DataField} DataField instance
                     */
                    DataField.create = function create(properties) {
                        return new DataField(properties);
                    };

                    /**
                     * Encodes the specified DataField message. Does not implicitly {@link bettercallsol.Transaction.Instruction.Data.DataField.verify|verify} messages.
                     * @function encode
                     * @memberof bettercallsol.Transaction.Instruction.Data.DataField
                     * @static
                     * @param {bettercallsol.Transaction.Instruction.Data.IDataField} message DataField message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    DataField.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                            writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
                        if (message.description != null && Object.hasOwnProperty.call(message, "description"))
                            writer.uint32(/* id 2, wireType 2 =*/18).string(message.description);
                        if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.type);
                        if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                            $root.google.protobuf.Value.encode(message.value, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                        return writer;
                    };

                    /**
                     * Encodes the specified DataField message, length delimited. Does not implicitly {@link bettercallsol.Transaction.Instruction.Data.DataField.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof bettercallsol.Transaction.Instruction.Data.DataField
                     * @static
                     * @param {bettercallsol.Transaction.Instruction.Data.IDataField} message DataField message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    DataField.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a DataField message from the specified reader or buffer.
                     * @function decode
                     * @memberof bettercallsol.Transaction.Instruction.Data.DataField
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {bettercallsol.Transaction.Instruction.Data.DataField} DataField
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    DataField.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.bettercallsol.Transaction.Instruction.Data.DataField();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1: {
                                    message.name = reader.string();
                                    break;
                                }
                            case 2: {
                                    message.description = reader.string();
                                    break;
                                }
                            case 3: {
                                    message.type = reader.int32();
                                    break;
                                }
                            case 4: {
                                    message.value = $root.google.protobuf.Value.decode(reader, reader.uint32());
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a DataField message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof bettercallsol.Transaction.Instruction.Data.DataField
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {bettercallsol.Transaction.Instruction.Data.DataField} DataField
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    DataField.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a DataField message.
                     * @function verify
                     * @memberof bettercallsol.Transaction.Instruction.Data.DataField
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    DataField.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        let properties = {};
                        if (message.name != null && message.hasOwnProperty("name")) {
                            properties._name = 1;
                            if (!$util.isString(message.name))
                                return "name: string expected";
                        }
                        if (message.description != null && message.hasOwnProperty("description")) {
                            properties._description = 1;
                            if (!$util.isString(message.description))
                                return "description: string expected";
                        }
                        if (message.type != null && message.hasOwnProperty("type"))
                            switch (message.type) {
                            default:
                                return "type: enum value expected";
                            case 0:
                            case 1:
                            case 2:
                            case 3:
                            case 4:
                            case 5:
                            case 6:
                            case 7:
                            case 8:
                            case 9:
                            case 10:
                            case 11:
                            case 12:
                            case 13:
                            case 14:
                            case 15:
                            case 16:
                                break;
                            }
                        if (message.value != null && message.hasOwnProperty("value")) {
                            let error = $root.google.protobuf.Value.verify(message.value);
                            if (error)
                                return "value." + error;
                        }
                        return null;
                    };

                    /**
                     * Creates a DataField message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof bettercallsol.Transaction.Instruction.Data.DataField
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {bettercallsol.Transaction.Instruction.Data.DataField} DataField
                     */
                    DataField.fromObject = function fromObject(object) {
                        if (object instanceof $root.bettercallsol.Transaction.Instruction.Data.DataField)
                            return object;
                        let message = new $root.bettercallsol.Transaction.Instruction.Data.DataField();
                        if (object.name != null)
                            message.name = String(object.name);
                        if (object.description != null)
                            message.description = String(object.description);
                        switch (object.type) {
                        default:
                            if (typeof object.type === "number") {
                                message.type = object.type;
                                break;
                            }
                            break;
                        case "UNSUPPORTED":
                        case 0:
                            message.type = 0;
                            break;
                        case "U8":
                        case 1:
                            message.type = 1;
                            break;
                        case "I8":
                        case 2:
                            message.type = 2;
                            break;
                        case "U16":
                        case 3:
                            message.type = 3;
                            break;
                        case "I16":
                        case 4:
                            message.type = 4;
                            break;
                        case "U32":
                        case 5:
                            message.type = 5;
                            break;
                        case "I32":
                        case 6:
                            message.type = 6;
                            break;
                        case "F32":
                        case 7:
                            message.type = 7;
                            break;
                        case "U64":
                        case 8:
                            message.type = 8;
                            break;
                        case "I64":
                        case 9:
                            message.type = 9;
                            break;
                        case "F64":
                        case 10:
                            message.type = 10;
                            break;
                        case "U128":
                        case 11:
                            message.type = 11;
                            break;
                        case "I128":
                        case 12:
                            message.type = 12;
                            break;
                        case "BOOL":
                        case 13:
                            message.type = 13;
                            break;
                        case "BYTES":
                        case 14:
                            message.type = 14;
                            break;
                        case "PUBLIC_KEY":
                        case 15:
                            message.type = 15;
                            break;
                        case "STRING":
                        case 16:
                            message.type = 16;
                            break;
                        }
                        if (object.value != null) {
                            if (typeof object.value !== "object")
                                throw TypeError(".bettercallsol.Transaction.Instruction.Data.DataField.value: object expected");
                            message.value = $root.google.protobuf.Value.fromObject(object.value);
                        }
                        return message;
                    };

                    /**
                     * Creates a plain object from a DataField message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof bettercallsol.Transaction.Instruction.Data.DataField
                     * @static
                     * @param {bettercallsol.Transaction.Instruction.Data.DataField} message DataField
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    DataField.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.defaults) {
                            object.type = options.enums === String ? "UNSUPPORTED" : 0;
                            object.value = null;
                        }
                        if (message.name != null && message.hasOwnProperty("name")) {
                            object.name = message.name;
                            if (options.oneofs)
                                object._name = "name";
                        }
                        if (message.description != null && message.hasOwnProperty("description")) {
                            object.description = message.description;
                            if (options.oneofs)
                                object._description = "description";
                        }
                        if (message.type != null && message.hasOwnProperty("type"))
                            object.type = options.enums === String ? $root.bettercallsol.Transaction.Instruction.Data.DataField.DataFieldType[message.type] === undefined ? message.type : $root.bettercallsol.Transaction.Instruction.Data.DataField.DataFieldType[message.type] : message.type;
                        if (message.value != null && message.hasOwnProperty("value"))
                            object.value = $root.google.protobuf.Value.toObject(message.value, options);
                        return object;
                    };

                    /**
                     * Converts this DataField to JSON.
                     * @function toJSON
                     * @memberof bettercallsol.Transaction.Instruction.Data.DataField
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    DataField.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    /**
                     * Gets the default type url for DataField
                     * @function getTypeUrl
                     * @memberof bettercallsol.Transaction.Instruction.Data.DataField
                     * @static
                     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns {string} The default type url
                     */
                    DataField.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                        if (typeUrlPrefix === undefined) {
                            typeUrlPrefix = "type.googleapis.com";
                        }
                        return typeUrlPrefix + "/bettercallsol.Transaction.Instruction.Data.DataField";
                    };

                    /**
                     * DataFieldType enum.
                     * @name bettercallsol.Transaction.Instruction.Data.DataField.DataFieldType
                     * @enum {number}
                     * @property {number} UNSUPPORTED=0 UNSUPPORTED value
                     * @property {number} U8=1 U8 value
                     * @property {number} I8=2 I8 value
                     * @property {number} U16=3 U16 value
                     * @property {number} I16=4 I16 value
                     * @property {number} U32=5 U32 value
                     * @property {number} I32=6 I32 value
                     * @property {number} F32=7 F32 value
                     * @property {number} U64=8 U64 value
                     * @property {number} I64=9 I64 value
                     * @property {number} F64=10 F64 value
                     * @property {number} U128=11 U128 value
                     * @property {number} I128=12 I128 value
                     * @property {number} BOOL=13 BOOL value
                     * @property {number} BYTES=14 BYTES value
                     * @property {number} PUBLIC_KEY=15 PUBLIC_KEY value
                     * @property {number} STRING=16 STRING value
                     */
                    DataField.DataFieldType = (function() {
                        const valuesById = {}, values = Object.create(valuesById);
                        values[valuesById[0] = "UNSUPPORTED"] = 0;
                        values[valuesById[1] = "U8"] = 1;
                        values[valuesById[2] = "I8"] = 2;
                        values[valuesById[3] = "U16"] = 3;
                        values[valuesById[4] = "I16"] = 4;
                        values[valuesById[5] = "U32"] = 5;
                        values[valuesById[6] = "I32"] = 6;
                        values[valuesById[7] = "F32"] = 7;
                        values[valuesById[8] = "U64"] = 8;
                        values[valuesById[9] = "I64"] = 9;
                        values[valuesById[10] = "F64"] = 10;
                        values[valuesById[11] = "U128"] = 11;
                        values[valuesById[12] = "I128"] = 12;
                        values[valuesById[13] = "BOOL"] = 13;
                        values[valuesById[14] = "BYTES"] = 14;
                        values[valuesById[15] = "PUBLIC_KEY"] = 15;
                        values[valuesById[16] = "STRING"] = 16;
                        return values;
                    })();

                    return DataField;
                })();

                return Data;
            })();

            return Instruction;
        })();

        return Transaction;
    })();

    return bettercallsol;
})();

export const google = $root.google = (() => {

    /**
     * Namespace google.
     * @exports google
     * @namespace
     */
    const google = {};

    google.protobuf = (function() {

        /**
         * Namespace protobuf.
         * @memberof google
         * @namespace
         */
        const protobuf = {};

        protobuf.Struct = (function() {

            /**
             * Properties of a Struct.
             * @memberof google.protobuf
             * @interface IStruct
             * @property {Object.<string,google.protobuf.IValue>|null} [fields] Struct fields
             */

            /**
             * Constructs a new Struct.
             * @memberof google.protobuf
             * @classdesc Represents a Struct.
             * @implements IStruct
             * @constructor
             * @param {google.protobuf.IStruct=} [properties] Properties to set
             */
            function Struct(properties) {
                this.fields = {};
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Struct fields.
             * @member {Object.<string,google.protobuf.IValue>} fields
             * @memberof google.protobuf.Struct
             * @instance
             */
            Struct.prototype.fields = $util.emptyObject;

            /**
             * Creates a new Struct instance using the specified properties.
             * @function create
             * @memberof google.protobuf.Struct
             * @static
             * @param {google.protobuf.IStruct=} [properties] Properties to set
             * @returns {google.protobuf.Struct} Struct instance
             */
            Struct.create = function create(properties) {
                return new Struct(properties);
            };

            /**
             * Encodes the specified Struct message. Does not implicitly {@link google.protobuf.Struct.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.Struct
             * @static
             * @param {google.protobuf.IStruct} message Struct message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Struct.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.fields != null && Object.hasOwnProperty.call(message, "fields"))
                    for (let keys = Object.keys(message.fields), i = 0; i < keys.length; ++i) {
                        writer.uint32(/* id 1, wireType 2 =*/10).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                        $root.google.protobuf.Value.encode(message.fields[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                    }
                return writer;
            };

            /**
             * Encodes the specified Struct message, length delimited. Does not implicitly {@link google.protobuf.Struct.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.Struct
             * @static
             * @param {google.protobuf.IStruct} message Struct message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Struct.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Struct message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.Struct
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.Struct} Struct
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Struct.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.Struct(), key, value;
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            if (message.fields === $util.emptyObject)
                                message.fields = {};
                            let end2 = reader.uint32() + reader.pos;
                            key = "";
                            value = null;
                            while (reader.pos < end2) {
                                let tag2 = reader.uint32();
                                switch (tag2 >>> 3) {
                                case 1:
                                    key = reader.string();
                                    break;
                                case 2:
                                    value = $root.google.protobuf.Value.decode(reader, reader.uint32());
                                    break;
                                default:
                                    reader.skipType(tag2 & 7);
                                    break;
                                }
                            }
                            message.fields[key] = value;
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a Struct message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.Struct
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.Struct} Struct
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Struct.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Struct message.
             * @function verify
             * @memberof google.protobuf.Struct
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Struct.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.fields != null && message.hasOwnProperty("fields")) {
                    if (!$util.isObject(message.fields))
                        return "fields: object expected";
                    let key = Object.keys(message.fields);
                    for (let i = 0; i < key.length; ++i) {
                        let error = $root.google.protobuf.Value.verify(message.fields[key[i]]);
                        if (error)
                            return "fields." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a Struct message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.Struct
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.Struct} Struct
             */
            Struct.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.Struct)
                    return object;
                let message = new $root.google.protobuf.Struct();
                if (object.fields) {
                    if (typeof object.fields !== "object")
                        throw TypeError(".google.protobuf.Struct.fields: object expected");
                    message.fields = {};
                    for (let keys = Object.keys(object.fields), i = 0; i < keys.length; ++i) {
                        if (typeof object.fields[keys[i]] !== "object")
                            throw TypeError(".google.protobuf.Struct.fields: object expected");
                        message.fields[keys[i]] = $root.google.protobuf.Value.fromObject(object.fields[keys[i]]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a Struct message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.Struct
             * @static
             * @param {google.protobuf.Struct} message Struct
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Struct.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.objects || options.defaults)
                    object.fields = {};
                let keys2;
                if (message.fields && (keys2 = Object.keys(message.fields)).length) {
                    object.fields = {};
                    for (let j = 0; j < keys2.length; ++j)
                        object.fields[keys2[j]] = $root.google.protobuf.Value.toObject(message.fields[keys2[j]], options);
                }
                return object;
            };

            /**
             * Converts this Struct to JSON.
             * @function toJSON
             * @memberof google.protobuf.Struct
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Struct.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Struct
             * @function getTypeUrl
             * @memberof google.protobuf.Struct
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Struct.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/google.protobuf.Struct";
            };

            return Struct;
        })();

        protobuf.Value = (function() {

            /**
             * Properties of a Value.
             * @memberof google.protobuf
             * @interface IValue
             * @property {google.protobuf.NullValue|null} [nullValue] Value nullValue
             * @property {number|null} [numberValue] Value numberValue
             * @property {string|null} [stringValue] Value stringValue
             * @property {boolean|null} [boolValue] Value boolValue
             * @property {google.protobuf.IStruct|null} [structValue] Value structValue
             * @property {google.protobuf.IListValue|null} [listValue] Value listValue
             */

            /**
             * Constructs a new Value.
             * @memberof google.protobuf
             * @classdesc Represents a Value.
             * @implements IValue
             * @constructor
             * @param {google.protobuf.IValue=} [properties] Properties to set
             */
            function Value(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Value nullValue.
             * @member {google.protobuf.NullValue|null|undefined} nullValue
             * @memberof google.protobuf.Value
             * @instance
             */
            Value.prototype.nullValue = null;

            /**
             * Value numberValue.
             * @member {number|null|undefined} numberValue
             * @memberof google.protobuf.Value
             * @instance
             */
            Value.prototype.numberValue = null;

            /**
             * Value stringValue.
             * @member {string|null|undefined} stringValue
             * @memberof google.protobuf.Value
             * @instance
             */
            Value.prototype.stringValue = null;

            /**
             * Value boolValue.
             * @member {boolean|null|undefined} boolValue
             * @memberof google.protobuf.Value
             * @instance
             */
            Value.prototype.boolValue = null;

            /**
             * Value structValue.
             * @member {google.protobuf.IStruct|null|undefined} structValue
             * @memberof google.protobuf.Value
             * @instance
             */
            Value.prototype.structValue = null;

            /**
             * Value listValue.
             * @member {google.protobuf.IListValue|null|undefined} listValue
             * @memberof google.protobuf.Value
             * @instance
             */
            Value.prototype.listValue = null;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * Value kind.
             * @member {"nullValue"|"numberValue"|"stringValue"|"boolValue"|"structValue"|"listValue"|undefined} kind
             * @memberof google.protobuf.Value
             * @instance
             */
            Object.defineProperty(Value.prototype, "kind", {
                get: $util.oneOfGetter($oneOfFields = ["nullValue", "numberValue", "stringValue", "boolValue", "structValue", "listValue"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new Value instance using the specified properties.
             * @function create
             * @memberof google.protobuf.Value
             * @static
             * @param {google.protobuf.IValue=} [properties] Properties to set
             * @returns {google.protobuf.Value} Value instance
             */
            Value.create = function create(properties) {
                return new Value(properties);
            };

            /**
             * Encodes the specified Value message. Does not implicitly {@link google.protobuf.Value.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.Value
             * @static
             * @param {google.protobuf.IValue} message Value message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Value.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.nullValue != null && Object.hasOwnProperty.call(message, "nullValue"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nullValue);
                if (message.numberValue != null && Object.hasOwnProperty.call(message, "numberValue"))
                    writer.uint32(/* id 2, wireType 1 =*/17).double(message.numberValue);
                if (message.stringValue != null && Object.hasOwnProperty.call(message, "stringValue"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.stringValue);
                if (message.boolValue != null && Object.hasOwnProperty.call(message, "boolValue"))
                    writer.uint32(/* id 4, wireType 0 =*/32).bool(message.boolValue);
                if (message.structValue != null && Object.hasOwnProperty.call(message, "structValue"))
                    $root.google.protobuf.Struct.encode(message.structValue, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                if (message.listValue != null && Object.hasOwnProperty.call(message, "listValue"))
                    $root.google.protobuf.ListValue.encode(message.listValue, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified Value message, length delimited. Does not implicitly {@link google.protobuf.Value.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.Value
             * @static
             * @param {google.protobuf.IValue} message Value message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Value.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Value message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.Value
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.Value} Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Value.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.Value();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.nullValue = reader.int32();
                            break;
                        }
                    case 2: {
                            message.numberValue = reader.double();
                            break;
                        }
                    case 3: {
                            message.stringValue = reader.string();
                            break;
                        }
                    case 4: {
                            message.boolValue = reader.bool();
                            break;
                        }
                    case 5: {
                            message.structValue = $root.google.protobuf.Struct.decode(reader, reader.uint32());
                            break;
                        }
                    case 6: {
                            message.listValue = $root.google.protobuf.ListValue.decode(reader, reader.uint32());
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a Value message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.Value
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.Value} Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Value.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Value message.
             * @function verify
             * @memberof google.protobuf.Value
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Value.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.nullValue != null && message.hasOwnProperty("nullValue")) {
                    properties.kind = 1;
                    switch (message.nullValue) {
                    default:
                        return "nullValue: enum value expected";
                    case 0:
                        break;
                    }
                }
                if (message.numberValue != null && message.hasOwnProperty("numberValue")) {
                    if (properties.kind === 1)
                        return "kind: multiple values";
                    properties.kind = 1;
                    if (typeof message.numberValue !== "number")
                        return "numberValue: number expected";
                }
                if (message.stringValue != null && message.hasOwnProperty("stringValue")) {
                    if (properties.kind === 1)
                        return "kind: multiple values";
                    properties.kind = 1;
                    if (!$util.isString(message.stringValue))
                        return "stringValue: string expected";
                }
                if (message.boolValue != null && message.hasOwnProperty("boolValue")) {
                    if (properties.kind === 1)
                        return "kind: multiple values";
                    properties.kind = 1;
                    if (typeof message.boolValue !== "boolean")
                        return "boolValue: boolean expected";
                }
                if (message.structValue != null && message.hasOwnProperty("structValue")) {
                    if (properties.kind === 1)
                        return "kind: multiple values";
                    properties.kind = 1;
                    {
                        let error = $root.google.protobuf.Struct.verify(message.structValue);
                        if (error)
                            return "structValue." + error;
                    }
                }
                if (message.listValue != null && message.hasOwnProperty("listValue")) {
                    if (properties.kind === 1)
                        return "kind: multiple values";
                    properties.kind = 1;
                    {
                        let error = $root.google.protobuf.ListValue.verify(message.listValue);
                        if (error)
                            return "listValue." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a Value message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.Value
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.Value} Value
             */
            Value.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.Value)
                    return object;
                let message = new $root.google.protobuf.Value();
                switch (object.nullValue) {
                default:
                    if (typeof object.nullValue === "number") {
                        message.nullValue = object.nullValue;
                        break;
                    }
                    break;
                case "NULL_VALUE":
                case 0:
                    message.nullValue = 0;
                    break;
                }
                if (object.numberValue != null)
                    message.numberValue = Number(object.numberValue);
                if (object.stringValue != null)
                    message.stringValue = String(object.stringValue);
                if (object.boolValue != null)
                    message.boolValue = Boolean(object.boolValue);
                if (object.structValue != null) {
                    if (typeof object.structValue !== "object")
                        throw TypeError(".google.protobuf.Value.structValue: object expected");
                    message.structValue = $root.google.protobuf.Struct.fromObject(object.structValue);
                }
                if (object.listValue != null) {
                    if (typeof object.listValue !== "object")
                        throw TypeError(".google.protobuf.Value.listValue: object expected");
                    message.listValue = $root.google.protobuf.ListValue.fromObject(object.listValue);
                }
                return message;
            };

            /**
             * Creates a plain object from a Value message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.Value
             * @static
             * @param {google.protobuf.Value} message Value
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Value.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (message.nullValue != null && message.hasOwnProperty("nullValue")) {
                    object.nullValue = options.enums === String ? $root.google.protobuf.NullValue[message.nullValue] === undefined ? message.nullValue : $root.google.protobuf.NullValue[message.nullValue] : message.nullValue;
                    if (options.oneofs)
                        object.kind = "nullValue";
                }
                if (message.numberValue != null && message.hasOwnProperty("numberValue")) {
                    object.numberValue = options.json && !isFinite(message.numberValue) ? String(message.numberValue) : message.numberValue;
                    if (options.oneofs)
                        object.kind = "numberValue";
                }
                if (message.stringValue != null && message.hasOwnProperty("stringValue")) {
                    object.stringValue = message.stringValue;
                    if (options.oneofs)
                        object.kind = "stringValue";
                }
                if (message.boolValue != null && message.hasOwnProperty("boolValue")) {
                    object.boolValue = message.boolValue;
                    if (options.oneofs)
                        object.kind = "boolValue";
                }
                if (message.structValue != null && message.hasOwnProperty("structValue")) {
                    object.structValue = $root.google.protobuf.Struct.toObject(message.structValue, options);
                    if (options.oneofs)
                        object.kind = "structValue";
                }
                if (message.listValue != null && message.hasOwnProperty("listValue")) {
                    object.listValue = $root.google.protobuf.ListValue.toObject(message.listValue, options);
                    if (options.oneofs)
                        object.kind = "listValue";
                }
                return object;
            };

            /**
             * Converts this Value to JSON.
             * @function toJSON
             * @memberof google.protobuf.Value
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Value.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Value
             * @function getTypeUrl
             * @memberof google.protobuf.Value
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Value.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/google.protobuf.Value";
            };

            return Value;
        })();

        /**
         * NullValue enum.
         * @name google.protobuf.NullValue
         * @enum {number}
         * @property {number} NULL_VALUE=0 NULL_VALUE value
         */
        protobuf.NullValue = (function() {
            const valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "NULL_VALUE"] = 0;
            return values;
        })();

        protobuf.ListValue = (function() {

            /**
             * Properties of a ListValue.
             * @memberof google.protobuf
             * @interface IListValue
             * @property {Array.<google.protobuf.IValue>|null} [values] ListValue values
             */

            /**
             * Constructs a new ListValue.
             * @memberof google.protobuf
             * @classdesc Represents a ListValue.
             * @implements IListValue
             * @constructor
             * @param {google.protobuf.IListValue=} [properties] Properties to set
             */
            function ListValue(properties) {
                this.values = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ListValue values.
             * @member {Array.<google.protobuf.IValue>} values
             * @memberof google.protobuf.ListValue
             * @instance
             */
            ListValue.prototype.values = $util.emptyArray;

            /**
             * Creates a new ListValue instance using the specified properties.
             * @function create
             * @memberof google.protobuf.ListValue
             * @static
             * @param {google.protobuf.IListValue=} [properties] Properties to set
             * @returns {google.protobuf.ListValue} ListValue instance
             */
            ListValue.create = function create(properties) {
                return new ListValue(properties);
            };

            /**
             * Encodes the specified ListValue message. Does not implicitly {@link google.protobuf.ListValue.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.ListValue
             * @static
             * @param {google.protobuf.IListValue} message ListValue message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ListValue.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.values != null && message.values.length)
                    for (let i = 0; i < message.values.length; ++i)
                        $root.google.protobuf.Value.encode(message.values[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified ListValue message, length delimited. Does not implicitly {@link google.protobuf.ListValue.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.ListValue
             * @static
             * @param {google.protobuf.IListValue} message ListValue message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ListValue.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ListValue message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.ListValue
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.ListValue} ListValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ListValue.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.ListValue();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            if (!(message.values && message.values.length))
                                message.values = [];
                            message.values.push($root.google.protobuf.Value.decode(reader, reader.uint32()));
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a ListValue message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.ListValue
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.ListValue} ListValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ListValue.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ListValue message.
             * @function verify
             * @memberof google.protobuf.ListValue
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ListValue.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.values != null && message.hasOwnProperty("values")) {
                    if (!Array.isArray(message.values))
                        return "values: array expected";
                    for (let i = 0; i < message.values.length; ++i) {
                        let error = $root.google.protobuf.Value.verify(message.values[i]);
                        if (error)
                            return "values." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a ListValue message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.ListValue
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.ListValue} ListValue
             */
            ListValue.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.ListValue)
                    return object;
                let message = new $root.google.protobuf.ListValue();
                if (object.values) {
                    if (!Array.isArray(object.values))
                        throw TypeError(".google.protobuf.ListValue.values: array expected");
                    message.values = [];
                    for (let i = 0; i < object.values.length; ++i) {
                        if (typeof object.values[i] !== "object")
                            throw TypeError(".google.protobuf.ListValue.values: object expected");
                        message.values[i] = $root.google.protobuf.Value.fromObject(object.values[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a ListValue message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.ListValue
             * @static
             * @param {google.protobuf.ListValue} message ListValue
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ListValue.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults)
                    object.values = [];
                if (message.values && message.values.length) {
                    object.values = [];
                    for (let j = 0; j < message.values.length; ++j)
                        object.values[j] = $root.google.protobuf.Value.toObject(message.values[j], options);
                }
                return object;
            };

            /**
             * Converts this ListValue to JSON.
             * @function toJSON
             * @memberof google.protobuf.ListValue
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ListValue.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ListValue
             * @function getTypeUrl
             * @memberof google.protobuf.ListValue
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ListValue.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/google.protobuf.ListValue";
            };

            return ListValue;
        })();

        return protobuf;
    })();

    return google;
})();

export { $root as default };
