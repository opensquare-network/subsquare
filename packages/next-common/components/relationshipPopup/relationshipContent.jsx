import { VIEW_TYPE } from "next-common/context/relationship";

import Indications from "./indications";
import Relationship from "./relationship";
import { useState } from "react";
import ViewTypeSelect from "./viewTypeSelect";
import useCommonRelationshipNode from "next-common/hooks/useCommonRelationshipNode";
import useDelegatorsRelationshipNode from "next-common/hooks/useDelegatorsRelationshipNode";
import { useContextAddress } from "next-common/context/address";
import RelationshipProvider from "next-common/context/relationship";

export function CommonRelationshipContent() {
  const sourceAddress = useContextAddress();
  const { isLoading, nodes, edges } = useCommonRelationshipNode(sourceAddress);
  return (
    <RelationshipProvider nodes={nodes} edges={edges} isLoading={isLoading}>
      <Relationship />
      <Indications viewType={VIEW_TYPE.COMMON} />
    </RelationshipProvider>
  );
}

export function DelegationRelationshipContent() {
  const sourceAddress = useContextAddress();
  const { isLoading, nodes, edges } =
    useDelegatorsRelationshipNode(sourceAddress);

  return (
    <RelationshipProvider nodes={nodes} edges={edges} isLoading={isLoading}>
      <Relationship />
      <Indications viewType={VIEW_TYPE.DELEGATION} />
    </RelationshipProvider>
  );
}

export default function RelationshipContent() {
  const [viewType, setViewType] = useState(VIEW_TYPE.COMMON);

  let content = null;
  if (viewType === VIEW_TYPE.DELEGATION) {
    content = <DelegationRelationshipContent />;
  } else {
    content = <CommonRelationshipContent />;
  }

  return (
    <>
      <ViewTypeSelect viewType={viewType} setViewType={setViewType} />
      {content}
    </>
  );
}
