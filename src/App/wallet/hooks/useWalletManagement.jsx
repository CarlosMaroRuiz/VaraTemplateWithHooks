import { useState, useEffect, useCallback } from 'react'
import { Keyring } from '@polkadot/keyring'
import { useApi, useAccount, useBalance } from '@gear-js/react-hooks'
import { mnemonicGenerate, mnemonicValidate } from '@polkadot/util-crypto'

export function useWalletManagement() {
  const { api, isApiReady } = useApi()
  const { account, isAccountReady } = useAccount()
  const [wallet, setWallet] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [transactions, setTransactions] = useState([])

  
  const { balance, isBalanceReady } = useBalance(
    account?.decodedAddress || wallet?.address
  )

  
  useEffect(() => {
    if (account && isAccountReady) {
      const connectedWallet = {
        address: account.decodedAddress,
        name: account.meta.name,
        isConnected: true,
        type: 'extension'
      }
      setWallet(connectedWallet)
    } else {
      loadStoredWallet()
    }
  }, [account, isAccountReady])

  // Cargar wallet guardada
  const loadStoredWallet = () => {
  
    try {
      const savedWallet = localStorage.getItem('vara_wallet')
      if (savedWallet) {
        setWallet({ 
          ...JSON.parse(savedWallet), 
          isConnected: false,
          type: 'local' 
        })
      }
    } catch (error) {
      console.error('Error loading stored wallet:', error)
      setError('Error al cargar la wallet guardada')
    }
  }
  const generateNewSeed = () => {
    try {
      if (account) {
        setError('Ya existe una wallet conectada vía extensión')
        return null
      }
      return mnemonicGenerate()
    } catch (error) {
      console.error('Error generating seed:', error)
      setError('Error generando nueva semilla')
      return null
    }
  }
  const validateSeed = (seed) => {
    try {
      return mnemonicValidate(seed)
    } catch (error) {
      return false
    }
  }
  const generateWalletFromSeed = async (seedPhrase) => {
    if (account) {
      setError('Ya hay una wallet conectada vía extensión')
      return null
    }
  
    setLoading(true)
    setError(null)
  
    try {
      if (!validateSeed(seedPhrase)) {
        throw new Error('Semilla inválida')
      }
  
     
      const keyring = new Keyring({ type: 'sr25519', ss58Format: 42 })
      const newAccount = keyring.addFromUri(seedPhrase)
      
      const newWallet = {
        mnemonic: seedPhrase,
        address: newAccount.address,
        publicKey: newAccount.publicKey.toString('hex'),
        isConnected: false,
        type: 'local'
      }
      
      setWallet(newWallet)
      localStorage.setItem('vara_wallet', JSON.stringify(newWallet))
  
      return newWallet
    } catch (error) {
      console.error('Error generating wallet:', error)
      setError('Error al generar wallet: ' + error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }
  const sendTransaction = async (destinationAddress, amount) => {
    if (!wallet || !isApiReady) {
      throw new Error('Wallet no inicializada o API no lista')
    }

    try {
      setLoading(true)
      const transfer = api.balance.transfer(destinationAddress, amount)
      const hash = await transfer.signAndSend(wallet.address)
      
      const newTransaction = {
        hash,
        type: 'send',
        amount,
        to: destinationAddress,
        timestamp: Date.now()
      }
      setTransactions(prev => [newTransaction, ...prev])

      return hash
    } catch (error) {
      setError('Error enviando transacción: ' + error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const formatBalance = (rawBalance) => {
    if (!rawBalance) return '0'
    try {
      return (BigInt(rawBalance) / BigInt(1e12)).toString()
    } catch (error) {
      console.error('Error formatting balance:', error)
      return '0'
    }
  }

  const disconnect = () => {
    if (account) {
      setError('No se puede desconectar una wallet de extensión desde aquí')
      return
    }

    localStorage.removeItem('vara_wallet')
    setWallet(null)
    setError(null)
  }

  const isValidAddress = useCallback((address) => {
    try {
      const keyring = new Keyring({ type: 'sr25519', ss58Format: 42 })
      return !!keyring.encodeAddress(address)
    } catch {
      return false
    }
  }, [])


  const getTransactionHistory = useCallback(() => {
    return transactions
  }, [transactions])

  return {

    wallet,
    account,
    loading,
    error,
    balance: isBalanceReady ? balance : null,
    transactions,

    
    isAccountReady,
    isApiReady,

    generateWalletFromSeed,
    generateNewSeed,
    sendTransaction,
    disconnect,

    validateSeed,
    formatBalance,
    isValidAddress,
    getTransactionHistory
  }
}