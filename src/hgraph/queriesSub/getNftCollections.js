const subGetNftCollections = `
subscription AccountNftCollectionsSubscription($accountId: bigint!) {
  account: entity_by_pk(id: $accountId) {
    collections: token_account(
      where: {token: {type: {_eq: "NON_FUNGIBLE_UNIQUE"}}, nft_aggregate: {count: {predicate: {_gt: 0}}}}
      distinct_on: token_id
    ) {
      token_id
      token {
        name
        initial_supply
        max_supply
        modified_timestamp
        symbol
        token_id
        total_supply
        type
        treasury_account_id
        freeze_key
        kyc_key
        pause_key
        supply_key
        wipe_key
        admin_key: entity {
          key: public_key
        }
        custom_fee {
          royalty_numerator
          royalty_denominator
          minimum_amount
          maximum_amount
          amount
          amount_denominator
          collector_account_id
        }
      }
      nfts: nft(order_by: {modified_timestamp: desc}, limit: 1) {
        modified_timestamp
        metadata
        serial_number
      }
      nft_aggregate(where: {account_id: {_eq: $accountId}}) {
        aggregate {
          count
        }
      }
    }
  }
 
}
`;

export default subGetNftCollections;
