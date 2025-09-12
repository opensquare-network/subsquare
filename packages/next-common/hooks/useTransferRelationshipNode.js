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

function createTransferRelationship(
  rootNode,
  accounts = [],
  transferVolumes = [],
) {
  const filteredAccounts = accounts.filter(
    (item) => item.address !== rootNode.data.address,
  );
  return createRelationship({
    rootNode,
    items: filteredAccounts,
    nodeIdPrefix: "transfer",
    edgeIdPrefix: "root-transfer",
    nodeDataMapper: (item) => ({
      address: item.address,
      badge: <BadgeInfo address={item.address} />,
      pure: <DynamicPureProxy address={item.address} />,
    }),
    edgeDataMapper: (node) => {
      const userTransferVolumes = transferVolumes.filter(
        (item) => item.from === node.address || item.to === node.address,
      );
      return {
        type: RELATIONSHIP_NODE_TYPE.Transfer,
        value: "Transfer",
        name: "Transfer",
        isTwoWay: userTransferVolumes.length > 1,
        userTransferVolumes,
      };
    },
    sourceKey: "node",
    targetKey: rootNodeId,
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
  }

  if (!sourceAddress) {
    return EMPTY_RESULT;
  }

  const { nodes: transferNodes, edges: transferEdges } =
    createTransferRelationship(
      rootNode,
      value?.accounts,
      value?.transferVolumes,
    );

  // console.log({ transferNodes, transferEdges });

  return {
    loading,
    nodes: [rootNode, ...transferNodes],
    edges: transferEdges,
  };
}
