import { useAsync } from "react-use";
import {
  BadgeInfo,
  createRelationship,
  createRootNode,
  DynamicPureProxy,
  EMPTY_RESULT,
  rootNodeId,
} from "./useRelationshipNode";
import useMaybeContextMultisigAddress from "./useMaybeContextMultisigAddress";
import { RELATIONSHIP_NODE_TYPE } from "next-common/utils/constants";
import { useChainSettings } from "next-common/context/chain";
import { isSameAddress, toPrecision } from "next-common/utils";
import ValueDisplay from "next-common/components/valueDisplay";
import pluralize from "pluralize";

function TransferName({ volume }) {
  const { symbol, decimals } = useChainSettings();
  return (
    <>
      <ValueDisplay
        showTooltip={false}
        value={toPrecision(volume, decimals, 2)}
        symbol={symbol}
        className="text-red500"
      />
    </>
  );
}

function createTransferRelationship(rootNode, accounts = [], direction) {
  const filteredAccounts = accounts.filter(
    (item) => item.address !== rootNode.data.address,
  );
  return createRelationship({
    rootNode,
    items: filteredAccounts,
    nodeIdPrefix: `transfer-${direction}`,
    edgeIdPrefix: `root-transfer-${direction}`,
    nodeDataMapper: (item) => ({
      address: item.address,
      username: item.username,
      transfer: item.data,
      badge: <BadgeInfo address={item.address} />,
      pure: <DynamicPureProxy address={item.address} />,
    }),
    edgeDataMapper: (data) => {
      const { count, volume } = data?.transfer || {};
      return {
        type: RELATIONSHIP_NODE_TYPE.Transfer,
        name: `${count} ${pluralize("transfer", count)}`,
        value: <TransferName volume={volume} />,
        data: data.transfer,
        username: data.username,
      };
    },
    sourceKey: direction === "incoming" ? "node" : rootNodeId,
    targetKey: direction === "incoming" ? rootNodeId : "node",
    sourceHandle: "sourceSub",
    targetHandle: "targetParent",
  });
}

export default function useTransferRelationshipNode(sourceAddress) {
  const { value, loading } = useAsync(async () => {
    if (!sourceAddress) {
      return EMPTY_RESULT;
    }
    const res = await fetch(
      `https://polkadot.api.followthedot.live:11200/account/${sourceAddress}/graph`,
    );
    const result = await res.json();
    return result;
  }, [sourceAddress]);

  const multisigAddress = useMaybeContextMultisigAddress(sourceAddress);
  const rootNode = createRootNode(sourceAddress, multisigAddress);

  if (rootNode?.data) {
    rootNode.data.pure = (
      <DynamicPureProxy
        address={sourceAddress}
        className="inline-flex absolute h-5 right-2 top-2"
      />
    );
    rootNode.data.username = getUsername(
      value?.accounts?.find((item) =>
        isSameAddress(item.address, sourceAddress),
      ),
    );
  }

  if (!sourceAddress) {
    return EMPTY_RESULT;
  }

  const { incoming, outgoing } = relationshipExtend(
    rootNode,
    value?.accounts,
    value?.transferVolumes,
  );

  const { nodes: incomingtransferNodes, edges: incomingtransferEdges } =
    createTransferRelationship(rootNode, incoming.nodes, "incoming");

  const { nodes: outgoingtransferNodes, edges: outgoingtransferEdges } =
    createTransferRelationship(rootNode, outgoing.nodes, "outgoing");

  return {
    isLoading: loading,
    nodes: [rootNode, ...incomingtransferNodes, ...outgoingtransferNodes],
    edges: [...incomingtransferEdges, ...outgoingtransferEdges],
  };
}

function getUsername(account) {
  if (account) {
    const { display, accountDisplay } = account.subscanAccount || {};
    const username = display || accountDisplay?.merkle?.tagName || null;
    return username;
  }
  return null;
}

function relationshipExtend(rootNode, accounts = [], transfers = []) {
  const rootAddress = rootNode?.data?.address || "";
  const accountsMap = new Map(
    accounts.map((account) => [account.address, account]),
  );
  const nodeMaps = { incoming: new Map(), outgoing: new Map() };
  const result = {
    incoming: { nodes: [], edges: [] },
    outgoing: { nodes: [], edges: [] },
  };

  const createNode = (address, transfer, direction) => {
    const nodeMap = nodeMaps[direction];
    if (!nodeMap.has(address)) {
      const item = accountsMap.get(address);
      if (item) {
        const username = getUsername(item);
        const node = { address, username, data: transfer };
        nodeMap.set(address, node);
        result[direction].nodes.push(node);
      }
    }
  };

  const createEdge = (source, target, direction, transfer) => {
    result[direction].edges.push({
      source: direction === "incoming" ? source : rootNode.id,
      target: direction === "incoming" ? rootNode.id : target,
      type: "transfer",
      data: transfer,
      direction,
    });
  };

  transfers.forEach((transfer) => {
    const { from, to } = transfer;
    if (from === rootAddress) {
      createNode(to, transfer, "outgoing");
      createEdge(rootNode.id, to, "outgoing", transfer);
    } else if (to === rootAddress) {
      createNode(from, transfer, "incoming");
      createEdge(from, rootNode.id, "incoming", transfer);
    }
  });

  return result;
}
