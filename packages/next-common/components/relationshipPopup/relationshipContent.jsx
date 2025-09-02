import { useRelationshipNodes } from "next-common/context/relationship";
import Indications from "./indications";
import Relationship from "./relationship";
import { useMemo } from "react";
import useCommonRelationshipNode from "next-common/hooks/useCommonRelationshipNode";
import useDelegatorsRelationshipNode from "next-common/hooks/useDelegatorsRelationshipNode";
import { useContextAddress } from "next-common/context/address";
import RelationshipProvider from "next-common/context/relationship";
import NoRelationshipsTip from "./noRelationshipsTip";
import {
  useRelationshipViewTypeState,
  VIEW_TYPE,
} from "next-common/context/relationship/selectViewType";

export function CommonRelationshipContent() {
  const sourceAddress = useContextAddress();
  const { isLoading, nodes, edges } = useCommonRelationshipNode(sourceAddress);

  return (
    <RelationshipProvider nodes={nodes} edges={edges} isLoading={isLoading}>
      <NoRelationshipsWrapper />
      <Relationship />
      <Indications />
    </RelationshipProvider>
  );
}

export function DelegationRelationshipContent() {
  const sourceAddress = useContextAddress();
  const { isLoading, nodes, edges } =
    useDelegatorsRelationshipNode(sourceAddress);

  return (
    <RelationshipProvider nodes={nodes} edges={edges} isLoading={isLoading}>
      <NoRelationshipsWrapper />
      <Relationship />
      <Indications />
    </RelationshipProvider>
  );
}

export default function RelationshipContent() {
  const { viewType } = useRelationshipViewTypeState();

  if (viewType === VIEW_TYPE.DELEGATION) {
    return <DelegationRelationshipContent />;
  } else if (viewType === VIEW_TYPE.COMMON) {
    return <CommonRelationshipContent />;
  }
  return null;
}

function NoRelationshipsWrapper() {
  const { nodes, edges, isLoading } = useRelationshipNodes();
  const { viewType } = useRelationshipViewTypeState();

  const isNoRelationships = useMemo(() => {
    if (isLoading) {
      return false;
    }

    return nodes?.length === 1 && edges?.length === 0;
  }, [isLoading, nodes, edges]);

  if (!isNoRelationships) {
    return null;
  }

  return <NoRelationshipsTip className="flex-1" type={viewType} />;
}
