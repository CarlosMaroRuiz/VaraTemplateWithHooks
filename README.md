# V1 Template varaNetwork Frontend

## useWalletManagement Hook

**useWalletManagement** is a custom React hook for managing wallets on the Vara network using @gear-js/react-hooks and @polkadot/keyring. It allows connecting extension wallets, generating wallets from a seed, validating addresses, checking balances, and sending transactions.

### State and Connection
- wallet: Contains information about the connected wallet.
- account: Account information obtained from the extension.
- balance: Current balance of the connected wallet.
- transactions: Transaction history.
isApiReady, isAccountReady: Verify if the API and account are ready.

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
The hook handles errors internally and exposes them in the error state.