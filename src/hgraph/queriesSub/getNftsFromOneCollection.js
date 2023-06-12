const subGetNftsFromOneCollection = `subscription nftsByAccountIdAndTokenId($accountId: bigint!, $tokenId: bigint!) {
  nft(
    where: {account_id: {_eq: $accountId}, token_id: {_eq: $tokenId}}
  ) {
    token_id
    metadata
    serial_number
    spender
    modified_timestamp
  }
}`;

export default subGetNftsFromOneCollection;
