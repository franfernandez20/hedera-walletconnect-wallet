import Client, { Network, Environment } from "@hgraph.io/sdk";
const ENVIRONMENT = process.env.NEXT_PUBLIC_HGRAPH_ENVIROMMENT;

const environment =
  ENVIRONMENT === "production"
    ? Environment.Production
    : Environment.Development;

const optionsMainnet = {
  network: Network.HederaMainnet,
  environment: environment,
};

const optionsTestnet = {
  network: Network.HederaTestnet,
  environment: environment,
};

const clientMainnet = new Client(optionsMainnet);
const clientTestnet = new Client(optionsTestnet);

export { clientMainnet, clientTestnet };
