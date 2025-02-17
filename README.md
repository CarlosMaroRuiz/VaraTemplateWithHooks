# V1 Template varaNetwork Frontend

## useWalletManagement Hook

**useWalletManagement** is a custom React hook for managing wallets on the Vara network using `@gear-js/react-hooks` and `@polkadot/keyring`. It allows connecting extension wallets, generating wallets from a seed, validating addresses, checking balances, and sending transactions.

### State and Connection
- **wallet**: Contains information about the connected wallet.
- **account**: Account information obtained from the extension.
- **balance**: Current balance of the connected wallet.
- **transactions**: Transaction history.
- **isApiReady**, **isAccountReady**: Flags to verify if the API and account are ready.

### Functions

#### `generateNewSeed()`
Generates a new mnemonic seed for wallet creation.

#### `validateSeed(seed: string)`
Validates whether the provided seed is valid.

#### `generateWalletFromSeed(seedPhrase: string)`
Generates a local wallet from a seed and stores it in `localStorage`.

#### `sendTransaction(destinationAddress: string, amount: number)`
Sends a transaction to a specified address.

#### `disconnect()`
Disconnects the local wallet and removes its stored information.

#### `formatBalance(rawBalance: string | BigInt)`
Formats the balance from raw format to a readable representation.

#### `isValidAddress(address: string)`
Verifies if an address is valid.

#### `getTransactionHistory()`
Returns the transaction history stored in the state.

### Considerations
- If a wallet is already connected via extension, generating a new local wallet is not allowed.
- Locally generated wallets cannot sign transactions on the blockchain without a proper provider.
- The hook handles errors internally and exposes them in the error state.

---

## SailsProvider Context

**SailsProvider** is a React context provider that initializes and provides an instance of **Sails** for handling interactions with the **Sails.js framework**. This provider is responsible for setting up API communication, loading IDL (Interface Definition Language) files, and handling potential initialization errors.

### Usage
The `SailsProvider` component should wrap the application or components that need access to the `Sails` instance.

### State Management
- **sails**: Stores the initialized **Sails** instance.
- **loading**: Indicates if the initialization process is still running.
- **error**: Stores any initialization errors.

### Initialization Process
Upon mounting, `SailsProvider`:
1. Creates a new **SailsIdlParser** instance.
2. Instantiates a **Sails** object.
3. Checks if the `api` prop is provided; throws an error if missing.
4. Fetches the IDL file (`app.idl`) from `/src/App/`.
5. Parses the IDL content and sets the **PROGRAM_ID**.
6. Provides the initialized **Sails** instance via React Context.

### Error Handling
- If the API is missing, an error is thrown.
- If fetching the IDL file fails, an error is stored in the state and displayed in the UI.

---

## useContractMutation Hook

**useContractMutation** is a custom React hook designed to interact with blockchain contracts through the **Sails** instance. It integrates with **useWalletManagement** for wallet operations, **useApi** for API interactions, and **GearKeyring** for signing transactions.

### How It Works
- **Dependencies**:
  - Uses the **Sails** context (via `useSails`) to access blockchain service functions.
  - Utilizes **useWalletManagement** to get connected wallet details.
  - Leverages **useApi** to ensure the blockchain API is initialized.
- **Initialization**:
  The hook maintains several states:
  - **loading**: Indicates if a transaction is in progress.
  - **error**: Stores any errors during the transaction process.
  - **success**: Indicates if the transaction was successful.
  - **transactionResult**: Contains details like message ID, block hash, and transaction hash.
  - **gasUsed**: Stores the gas used by the transaction.
  - **response**: Contains the transaction response data.

### Functions

#### `sendTransaction(...args)`
Sends a transaction using the provided service and method names. It:
1. Verifies that **Sails**, the wallet (with its mnemonic), and **API** are initialized.
2. Creates a `GearKeyring` from the wallet mnemonic.
3. Retrieves the transaction function from `sails.services` based on the given `serviceName` and `methodName`.
4. Configures the transaction with the account obtained from the keyring.
5. Calculates the gas required for the transaction.
6. Signs and sends the transaction, capturing the response, message ID, block hash, and transaction hash.
7. Updates the state with the transaction result and response, or sets an error if one occurs.

### Return Values
- **loading**: `true` while the transaction is processing.
- **error**: Contains the error message if the transaction fails.
- **success**: `true` if the transaction completes successfully.
- **transactionResult**: An object with the transaction details (`messageId`, `blockHash`, `txHash`, and `response`).
- **gasUsed**: The amount of gas used in the transaction.
- **sendTransaction**: Function to trigger the transaction.
- **response**: The response data from the transaction execution.

---

## useContractQuery Hook

**useContractQuery** is a custom React hook for querying blockchain contracts via the **Sails** instance. It integrates with **useWalletManagement** to obtain the wallet address and automatically executes the query when the dependencies change.

### How It Works
- **Dependencies**:
  - Uses the **Sails** context (via `useSails`) to access blockchain query functions.
  - Utilizes **useWalletManagement** to get the connected wallet's address.
- **Initialization**:
  The hook manages three states:
  - **data**: Stores the query result.
  - **loading**: Indicates if the query is still in progress.
  - **error**: Captures any errors that occur during the query.

### Query Execution
1. The hook listens for changes in `sails`, `wallet`, `serviceName`, `methodName`, or any additional arguments.
2. If **Sails** is initialized and the wallet has an address, it triggers the query.
3. Executes the query function from `sails.services[serviceName].queries[methodName]` with the wallet address and additional arguments.
4. Updates the state with the query result or captures any errors.

### Return Values
- **data**: The data returned from the query.
- **loading**: `true` while the query is processing.
- **error**: Contains an error message if the query fails.
