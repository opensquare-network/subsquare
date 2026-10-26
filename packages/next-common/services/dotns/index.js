import {
  createPublicClient,
  defineChain,
  http,
  parseAbi,
  zeroAddress,
} from "viem";
import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";
import { getDotnsNameNode, stripTld } from "./utils";

const BATCH_SIZE = 200;
const CACHE_TTL = 60 * 1000;

const storeFactoryAbi = parseAbi([
  "function getLabelStoreCount() view returns (uint256)",
  "function getLabelStores(uint256 offset, uint256 limit) view returns (address[])",
  "function getLabelStore(address user) view returns (address)",
  "function getUserStore(address user) view returns (address)",
]);

const labelStoreAbi = parseAbi([
  "function owner() view returns (address)",
  "function getLabelCount() view returns (uint256)",
  "function getLabels(uint256 offset, uint256 limit) view returns (string[])",
]);

const registrarAbi = parseAbi([
  "function ownerOf(uint256 tokenId) view returns (address)",
]);

const protocolRegistryAbi = parseAbi([
  "function tld() view returns (string)",
  "function tldNode() view returns (bytes32)",
]);

let cachedClient = null;
let cachedClientRpcUrl = null;
let cachedDotNsWebIds = null;
let cachedAt = 0;

export function getDotnsDeployment() {
  return getChainSettings(CHAIN)?.dotns || null;
}

function getDotnsClient(deployment) {
  if (cachedClient && cachedClientRpcUrl === deployment.rpcUrl) {
    return cachedClient;
  }

  const { symbol, decimals } = getChainSettings(CHAIN);
  const chain = defineChain({
    id: deployment.chainId,
    name: "dotNS",
    nativeCurrency: { name: symbol, symbol, decimals },
    rpcUrls: {
      default: { http: [deployment.rpcUrl] },
    },
    contracts: {
      multicall3: { address: deployment.multicall3 },
    },
  });

  cachedClient = createPublicClient({
    chain,
    transport: http(deployment.rpcUrl),
  });
  cachedClientRpcUrl = deployment.rpcUrl;

  return cachedClient;
}

function isZeroAddress(address) {
  return !address || address.toLowerCase() === zeroAddress;
}

function chunk(items, size) {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

async function multicallInBatches(client, contracts) {
  const results = [];
  for (const batch of chunk(contracts, BATCH_SIZE)) {
    const batchResults = await client.multicall({
      contracts: batch,
      allowFailure: true,
    });
    results.push(...batchResults);
  }
  return results;
}

async function fetchLabelStores(client, storeFactory) {
  const count = await client.readContract({
    address: storeFactory,
    abi: storeFactoryAbi,
    functionName: "getLabelStoreCount",
  });

  const stores = [];
  for (let offset = 0n; offset < count; offset += BigInt(BATCH_SIZE)) {
    const remaining = count - offset;
    const limit =
      remaining < BigInt(BATCH_SIZE) ? remaining : BigInt(BATCH_SIZE);
    const page = await client.readContract({
      address: storeFactory,
      abi: storeFactoryAbi,
      functionName: "getLabelStores",
      args: [offset, limit],
    });
    stores.push(...page);
  }

  return stores;
}

async function fetchLabelsByStore(client, stores) {
  const countResults = await multicallInBatches(
    client,
    stores.map((store) => ({
      address: store,
      abi: labelStoreAbi,
      functionName: "getLabelCount",
    })),
  );

  const requests = [];
  const requestStoreIndexes = [];
  countResults.forEach((result, storeIndex) => {
    if (result.status !== "success") {
      return;
    }

    const count = result.result;
    for (let offset = 0n; offset < count; offset += BigInt(BATCH_SIZE)) {
      const remaining = count - offset;
      const limit =
        remaining < BigInt(BATCH_SIZE) ? remaining : BigInt(BATCH_SIZE);
      requests.push({
        address: stores[storeIndex],
        abi: labelStoreAbi,
        functionName: "getLabels",
        args: [offset, limit],
      });
      requestStoreIndexes.push(storeIndex);
    }
  });

  const labelsByStore = stores.map(() => []);
  const labelsResults = await multicallInBatches(client, requests);
  labelsResults.forEach((result, index) => {
    if (result.status !== "success") {
      return;
    }
    labelsByStore[requestStoreIndexes[index]].push(...result.result);
  });

  return labelsByStore;
}

function collectRegisteredLabels(stores, labelsByStore, tld) {
  const labels = [];
  for (let index = stores.length - 1; index >= 0; index -= 1) {
    // Newer label stores hold the more recent registrations
    labels.push(...labelsByStore[index].slice().reverse());
  }

  const existingLabels = new Set();
  return labels.filter((label) => {
    const key = stripTld(label, tld).toLowerCase();
    if (existingLabels.has(key)) {
      return false;
    }
    existingLabels.add(key);
    return true;
  });
}

async function fetchDotNsWebIdsFromChain(deployment) {
  const client = getDotnsClient(deployment);

  const [tldNode, tld] = await client.multicall({
    contracts: [
      {
        address: deployment.protocolRegistry,
        abi: protocolRegistryAbi,
        functionName: "tldNode",
      },
      {
        address: deployment.protocolRegistry,
        abi: protocolRegistryAbi,
        functionName: "tld",
      },
    ],
    allowFailure: false,
  });

  const stores = await fetchLabelStores(client, deployment.storeFactory);
  if (!stores.length) {
    return [];
  }

  const labelsByStore = await fetchLabelsByStore(client, stores);
  // Label stores keep the labels of names that may have been transferred away,
  // so the registrar stays the source of truth for the current owner
  const labels = collectRegisteredLabels(stores, labelsByStore, tld);
  if (!labels.length) {
    return [];
  }

  const nodeByLabel = new Map(
    labels.map((label) => [
      label,
      getDotnsNameNode(tldNode, stripTld(label, tld)),
    ]),
  );

  const owners = await multicallInBatches(
    client,
    labels.map((label) => ({
      address: deployment.registrar,
      abi: registrarAbi,
      functionName: "ownerOf",
      args: [BigInt(nodeByLabel.get(label))],
    })),
  );

  const registered = [];
  owners.forEach((result, index) => {
    if (result.status !== "success") {
      return;
    }
    registered.push({ label: labels[index], owner: result.result });
  });

  const uniqueOwners = [...new Set(registered.map(({ owner }) => owner))];
  const storeResults = await multicallInBatches(
    client,
    uniqueOwners.flatMap((owner) => [
      {
        address: deployment.storeFactory,
        abi: storeFactoryAbi,
        functionName: "getLabelStore",
        args: [owner],
      },
      {
        address: deployment.storeFactory,
        abi: storeFactoryAbi,
        functionName: "getUserStore",
        args: [owner],
      },
    ]),
  );

  const storesByOwner = new Map();
  uniqueOwners.forEach((owner, index) => {
    const labelStore = storeResults[index * 2];
    const userStore = storeResults[index * 2 + 1];
    storesByOwner.set(owner, {
      labelStore: labelStore?.status === "success" ? labelStore.result : null,
      userStore: userStore?.status === "success" ? userStore.result : null,
    });
  });

  return registered.map(({ label, owner }) => {
    const ownerStores = storesByOwner.get(owner) || {};
    return {
      node: nodeByLabel.get(label),
      label,
      name: stripTld(label, tld),
      tld,
      owner,
      labelStore: isZeroAddress(ownerStores.labelStore)
        ? null
        : ownerStores.labelStore,
      userStore: isZeroAddress(ownerStores.userStore)
        ? null
        : ownerStores.userStore,
    };
  });
}

export async function fetchDotNsWebIds({ force = false } = {}) {
  const deployment = getDotnsDeployment();
  if (!deployment) {
    throw new Error("dotNS is not supported on this chain");
  }

  if (!force && cachedDotNsWebIds && Date.now() - cachedAt < CACHE_TTL) {
    return cachedDotNsWebIds;
  }

  const dotNsWebIds = await fetchDotNsWebIdsFromChain(deployment);
  cachedDotNsWebIds = dotNsWebIds;
  cachedAt = Date.now();

  return dotNsWebIds;
}

const labelStoreDetails = new Map();

export async function fetchLabelStoreDetail(labelStore) {
  const deployment = getDotnsDeployment();
  if (!deployment) {
    throw new Error("dotNS is not supported on this chain");
  }
  if (!labelStore) {
    throw new Error("Label store address is required");
  }

  const key = labelStore.toLowerCase();
  const cached = labelStoreDetails.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.detail;
  }

  const client = getDotnsClient(deployment);
  const [owner, count] = await client.multicall({
    contracts: [
      { address: labelStore, abi: labelStoreAbi, functionName: "owner" },
      {
        address: labelStore,
        abi: labelStoreAbi,
        functionName: "getLabelCount",
      },
    ],
    allowFailure: false,
  });

  const labels = [];
  for (let offset = 0n; offset < count; offset += BigInt(BATCH_SIZE)) {
    const remaining = count - offset;
    const limit =
      remaining < BigInt(BATCH_SIZE) ? remaining : BigInt(BATCH_SIZE);
    const page = await client.readContract({
      address: labelStore,
      abi: labelStoreAbi,
      functionName: "getLabels",
      args: [offset, limit],
    });
    labels.push(...page);
  }

  const detail = { address: labelStore, owner, labels };
  labelStoreDetails.set(key, { timestamp: Date.now(), detail });

  return detail;
}
