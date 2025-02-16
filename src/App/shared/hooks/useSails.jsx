import { useSailsCalls } from '@gear-js/react-hooks'

export function useSails() {
  const sails = useSailsCalls()

  const executeTransaction = async (command, args) => {
    if (!sails) throw new Error('Sails not initialized')

    return await sails.command(command, sails.account, {
      callArguments: args
    })
  }

  return {
    sails,
    executeTransaction
  }
}