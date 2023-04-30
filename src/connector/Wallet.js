import { WalletConnector } from "@hashgraph/hedera-wallet-connect";
import { useState } from "react";
import Signer from "./Signer";
import { getSubFungibleTokens } from "../hgraph/hgraph-sub";

// FILL THIS WITH YOUR ACCOUNT ID AND OPERATOR KEY
const accountId = "";
const operatorKey = "";
const network = "testnet";

function Wallet() {
  const [connector, setConnector] = useState(
    /** @type {WalletConnector} */ (null)
  );

  const [paringString, setParingString] = useState("");
  const [unSub, setUnSub] = useState(null);
  const [fungibleTokens, setFungibleTokens] = useState([]);

  const walletMetadata = {
    name: "Wallet",
    description: "Hedera Wallet connect example",
    icon: "https://avatars.githubusercontent.com/u/37784886",
  };

  const handleInit = async () => {
    console.log("handleA--");
    const _connector = new WalletConnector(walletMetadata);

    await _connector.init(async (proposal) => {
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

      const aproveResponse = await _connector.approveSessionProposal(
        {
          id,
          namespaces,
          relayProtocol: relays[0].protocol,
        },
        [signer]
      );

      console.log("Session aproved: ", aproveResponse);
    });

    setConnector(_connector);
    console.log("connectorR", _connector);
  };

  const handlePair = async () => {
    const pairResponse = await connector.pair(paringString);
    console.log("Pair RESPONSE: ", pairResponse);
  };

  const handleSub = async () => {
    const unSub = getSubFungibleTokens(setFungibleTokens, accountId, network);
    setUnSub(unSub);
  };

  const handleUnSub = async () => {
    await unSub();
  };
  const handleLog = async () => {
    console.log("fungibleTokens: ", fungibleTokens);
  };

  return (
    <div>
      <div>
        <button onClick={() => handleInit()}> - init - </button>
        <br></br>
        <button onClick={() => handlePair()}> - Pair - </button>
        <input type="text" onChange={(e) => setParingString(e.target.value)} />
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
