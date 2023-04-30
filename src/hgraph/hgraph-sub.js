const subFungibleTokens = `
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
}`;

export const getSubFungibleTokens = async (
  onSubUpdate,
  accountId,
  hederaNetwork
) => {
  const { default: hg } = await import("@hgraph.io/sdk");
  const accountParsed = accountId.toString().replace("0.0.", "");

  const unSubscribe = await hg(subFungibleTokens, {
    headers: {
      "x-hgraph-network": hederaNetwork,
      /*  authorization:
          'Bearer <>', */
    },
    variables: { accountId: accountParsed },
    next: ({ data, errors }) => {
      if (errors) {
        console.log("getSubFungibleTokens errors", errors);
        //TODO: handle errors
      }
      const dataParsed = {
        balance: data?.entity_by_pk?.balance,
        token_account: data?.entity_by_pk?.token_account?.filter(
          (token) => token.associated === true
        ),
      };
      onSubUpdate(dataParsed);
    },
    error: (error) => {
      console.error(error);
    },
    complete: () => {
      console.log("Optionally do some cleanup");
    },
  });
  return unSubscribe;
};
