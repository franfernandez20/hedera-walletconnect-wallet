import { WalletConnector } from "@hashgraph/hedera-wallet-connect";
import { useState, useEffect, useRef } from "react";
import Signer from "./Signer";
import {
  getSubFungibleTokens,
  getSubNftsCollections,
  getSubNftsFromOneCollection,
} from "../hgraph/hgraph-sub";
import { AccountId, Client } from "@hashgraph/sdk";
import { transferNft } from "../hedera/service";

// FILL THIS WITH YOUR ACCOUNT ID AND OPERATOR KEY
const accountId = "";
const operatorKey = "";
const network = "testnet";

const walletMetadata = {
  name: "Wallet",
  description: "Hedera Wallet connect example",
  icon: "https://avatars.githubusercontent.com/u/37784886",
};

const connector = new WalletConnector(walletMetadata);
const hederaClient = Client.forNetwork("testnet").setOperator(
  AccountId.fromString(accountId),
  operatorKey
);
async function init() {
  await connector.init(async (proposal) => {
    console.log("Session proposal !!", proposal);
    const { id, params } = proposal;
    const { requiredNamespaces, relays } = params;

    if (!requiredNamespaces.hedera)
      throw new Error("Only Hedera chain is supported");

    const signer = new Signer(accountId, operatorKey, network);

    const accounts = [`hedera:296:${accountId}`];
    const namespaces = {
      hedera: {
        accounts,
        methods: requiredNamespaces.hedera.methods,
        events: requiredNamespaces.hedera.events,
      },
    };

    const approveResponse = await connector.approveSessionProposal(
      {
        id,
        namespaces,
        relayProtocol: relays[0].protocol,
      },
      [signer]
    );

    console.log("Session approved: ", approveResponse);
  });
}

function Wallet() {
  const [paringString, setParingString] = useState("");
  const unSubPromise = useRef(new Promise(() => {}));
  const [fungibleTokens, setFungibleTokens] = useState([]);
  const [galleryNfts, setGalleryNfts] = useState([]);
  const [nftsFromOneCollection, setNftsFromOneCollection] = useState([]);
  const [unSubNftsFromOneCollection, setUnSubNftsFromOneCollection] =
    useState(null);

  useEffect(() => {
    init();
  }, []);

  const handlePair = async () => {
    console.log(paringString);
    const pairResponse = await connector.pair(paringString);
    console.log("Pair RESPONSE: ", pairResponse);
  };

  const handleSub = () => {
    unSubPromise.current = getSubFungibleTokens(setFungibleTokens, accountId);
  };

  const handleUnSub = async () => {
    const unSubFunction = await unSubPromise.current;
    console.log(await unSubFunction);
    unSubFunction();
  };
  const handleLog = async () => {
    console.log("fungibleTokens: ", fungibleTokens);
  };

  const handleSendNft = async () => {
    const tokenId = "";
    const serialNumber = 1;
    const senderAccount = accountId;
    const receiverAccount = "";
    const memo = "";

    const receipt = await transferNft(
      hederaClient,
      tokenId,
      serialNumber,
      senderAccount,
      receiverAccount,
      memo
    );
    console.log("receipt: ", receipt);
  };

  const handleSubNftCollections = () => {
    getSubNftsCollections(setGalleryNfts, accountId, "testnet");
  };
  console.log("galleryNfts: ", galleryNfts);

  const handleSubNftsFromOneCollection = () => {
    const tokenId = "0.0.3065157";
    const unSub = getSubNftsFromOneCollection(
      setNftsFromOneCollection,
      accountId,
      tokenId,
      "testnet"
    );
    setUnSubNftsFromOneCollection(unSub);
  };
  console.log("nftsFromOneCollection: ", nftsFromOneCollection);

  const handleUnSubNftsFromOneCollection = async () => {
    console.log("UNSUBING NFTS FROM ONE COLLECTION");
    await unSubNftsFromOneCollection();
  };

  console.log("unSubNftsFromOneCollection: ", unSubNftsFromOneCollection);

  return (
    <div>
      <div>
        <button onClick={() => handleSubNftCollections()}>
          {" "}
          - Create NFTs Gallery Sub -{" "}
        </button>
        <br></br>
        <button onClick={() => handleSubNftsFromOneCollection()}>
          {" "}
          - Create Sub for NFTs inside of one Token Id -{" "}
        </button>
        <button onClick={() => handleUnSubNftsFromOneCollection()}>
          {" "}
          - UnSub from one specific Token Id -{" "}
        </button>
        <br></br>
        <button onClick={handleSendNft}> - Send NFT - </button>
      </div>
      <hr></hr>
      <div>
        <button onClick={() => handlePair()}> - Pair - </button>
        <input
          type="text"
          onChange={(e) => setParingString(e.target.value)}
          value={paringString}
        />
      </div>
      <hr></hr>
      <div>
        <button onClick={() => handleSub()}> - Create Subscription - </button>
        <br></br>
        <button onClick={() => handleUnSub()}> - Delete Subscription - </button>
        <br></br>
        <button onClick={() => handleLog()}> - Log FTs - </button>
      </div>
    </div>
  );
}

export default Wallet;
