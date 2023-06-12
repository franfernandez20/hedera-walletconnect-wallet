import { clientMainnet, clientTestnet } from "./client.js";
const getClient = (hederaNetwork) => {
  return hederaNetwork === "mainnet" ? clientMainnet : clientTestnet;
};

export { getClient };
