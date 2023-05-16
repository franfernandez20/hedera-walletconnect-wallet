import Client, {Network, Environment} from '@hgraph.io/sdk'

const options = {
  network: Network.HederaTestnet,
  environment: Environment.Development,
}

const FungibleTokensSubscription = `
subscription AccountTokenBalances($accountId: bigint!) {
  entity_by_pk(id: $accountId) {
        balance
        token_account(
          where: {token: {type: {_eq: "FUNGIBLE_COMMON"}}}
        ) {
      balance
      associated
      token {
        decimals
        token_id
        type
        name
        symbol
        max_supply
        initial_supply
        treasury_account_id
      }
    }
  }
}`

const client = new Client(options)

export const getSubFungibleTokens = async (next, fullAccountId) => {
  return client.subscribe(
    {
      query: FungibleTokensSubscription,
      variables: {accountId: fullAccountId.replace('0.0.', '')},
    },
    {
      // handle the data
      next: (data) => {
        console.log(data)
        next(data)
      },
      error: (e) => {
        console.error(e)
      },
      complete: () => {
        console.log('Optionally do some cleanup')
      },
    }
  )
}
