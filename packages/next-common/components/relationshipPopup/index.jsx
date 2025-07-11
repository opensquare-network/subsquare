import { noop } from "@polkadot/util";
import { cn } from "next-common/utils";
import useConversionRelationshipNode from "next-common/hooks/useConversionRelationshipNode";
import Popup from "../popup/wrapper/Popup";
import Indications from "./indications";
import Relationship from "./relationship";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import { useMemo } from "react";
import RelationshipProvider from "next-common/context/relationship";
import SourceAddressProvider, {
  useSourceAddress,
} from "next-common/context/relationship/sourceAddress";

function NoRelationshipsTip() {
  return (
    <GreyPanel className="justify-start gap-x-2 text14Medium text-textSecondary py-2.5 px-4 max-w-full">
      This account has no relationships with proxy, multisig and identity.
    </GreyPanel>
  );
}

function RelationshipImpl() {
  const { sourceAddress } = useSourceAddress() || {};
  const { isLoading, nodes, edges } =
    useConversionRelationshipNode(sourceAddress);

  const showNoRelationshipsTip = useMemo(() => {
    if (isLoading) {
      return false;
    }

    return nodes?.length === 1 && edges?.length === 0;
  }, [isLoading, nodes, edges]);
  return (
    <RelationshipProvider
      sourceAddress={sourceAddress}
      isLoading={isLoading}
      nodes={nodes}
      edges={edges}
    >
      {showNoRelationshipsTip && <NoRelationshipsTip />}
      <Relationship />
      <Indications />
    </RelationshipProvider>
  );
}

export default function RelationshipPopup({
  title = "Relatives",
  className = "",
  onClose = noop,
  sourceAddress = "",
}) {
  if (!sourceAddress) {
    return null;
  }
  return (
    <Popup
      className={cn("w-[960px]", className)}
      title={title}
      onClose={onClose}
    >
      <SourceAddressProvider sourceAddress={sourceAddress}>
        <RelationshipImpl />
      </SourceAddressProvider>
    </Popup>
  );
}
