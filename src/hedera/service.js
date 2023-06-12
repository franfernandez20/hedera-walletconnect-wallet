import { Hbar, TransferTransaction } from "@hashgraph/sdk";

export const transferNft = async (
  client,
  tokenId,
  serialNumber,
  senderAccount,
  receiverAccount,
  memo
) => {
  try {
    let response = new TransferTransaction()
      .setMaxTransactionFee(new Hbar(10))
      .addNftTransfer(tokenId, serialNumber, senderAccount, receiverAccount)
      .setTransactionMemo(memo);
    const txSubmit = await response.execute(client);
    const receipt = await txSubmit.getReceipt(client);
    return receipt;
  } catch (error) {
    console.log("Error - Nfts - transferNft", { error });
  }
};
