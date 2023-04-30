// eslint-disable-next-line no-unused-vars
import { Client } from "@hashgraph/sdk";

class Signer {
  constructor(accountId, operatorKey, network) {
    /** @type {Client} */
    let _client = Client.forNetwork(network);
    _client.setOperator(accountId, operatorKey);
    this.client = _client;
  }

  getAccountId() {
    return this.client.operatorAccountId.toString();
  }

  /**
   *
   * @param {Transaction} transaction
   */
  async signTransaction(transaction) {
    return transaction.signWithOperator(this.client);
  }
}

export default Signer;
