import Client, { Network, Environment } from "@hgraph.io/sdk";
import { getClient } from "./utils";
import { removeFirstDoubleCeroAndDots } from "../hedera/utils";
import subGetNftCollections from "./queriesSub/getNftCollections";
import subGetNftsFromOneCollection from "./queriesSub/getNftsFromOneCollection";

const options = {
  network: Network.HederaTestnet,
  environment: Environment.Development,
};

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
}`;

const client = new Client(options);

export const getSubFungibleTokens = async (next, fullAccountId) => {
  return client.subscribe(
    {
      query: FungibleTokensSubscription,
      variables: { accountId: fullAccountId.replace("0.0.", "") },
    },
    {
      // handle the data
      next: (data) => {
        console.log(data);
        next(data);
      },
      error: (e) => {
        console.error(e);
      },
      complete: () => {
        console.log("Optionally do some cleanup");
      },
    }
  );
};

export const getSubNftsCollections = async (
  onSubUpdate,
  accountId,
  hederaNetwork
) => {
  const _client = getClient(hederaNetwork);
  const accountParsed = removeFirstDoubleCeroAndDots(accountId);
  const options = {
    query: subGetNftCollections,
    variables: { accountId: accountParsed },
    /*  authorization:
     */
  };
  const unSubscribe = _client.subscribe(options, {
    next: ({ data, errors }) => {
      if (errors) {
        //TODO: handle errors
      }
      const parsedCollections = data?.account?.collections
        ?.map((collection) => ({
          token_id: collection?.token_id,
          token: collection?.token,
          nfts: collection?.nfts,
          count: collection?.nft_aggregate?.aggregate?.count,
        }))
        .sort((a, b) => a.token.name.localeCompare(b.token.name));
      onSubUpdate(parsedCollections ?? []);
    },
    error: (error) => {
      console.error(error);
    },
    complete: () => {},
  });
  return unSubscribe;
};

export const getSubNftsFromOneCollection = async (
  onSubUpdate,
  accountId,
  tokenId,
  hederaNetwork
) => {
  const _client = getClient(hederaNetwork);
  const accountParsed = removeFirstDoubleCeroAndDots(accountId);
  const tokenIdParsed = removeFirstDoubleCeroAndDots(tokenId);
  const options = {
    query: subGetNftsFromOneCollection,
    variables: { accountId: accountParsed, tokenId: tokenIdParsed },
    /*  authorization:
     */
  };
  const unSubscribe = _client.subscribe(options, {
    variables: { accountId: accountParsed, tokenId: tokenIdParsed },
    // The client supports filtering the response date using jmespath -  https://jmespath.org/
    next: ({ data, errors }) => {
      if (errors) {
        //TODO: handle errors
      }

      onSubUpdate(data?.nft || []);
    },
    error: (error) => {
      console.error(error);
    },
    complete: () => {},
  });
  return unSubscribe;
};
