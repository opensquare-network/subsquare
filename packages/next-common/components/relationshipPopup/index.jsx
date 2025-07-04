import { noop } from "@polkadot/util";
import { cn } from "next-common/utils";
import useConversionRelationshipNode from "next-common/hooks/useConversionRelationshipNode";
import Popup from "../popup/wrapper/Popup";
import Indications from "./indications";
import Relationship from "./relationship";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import { useMemo } from "react";
import RelationshipProvider from "next-common/context/relationship";

function NoRelationshipsTip() {
  return (
    <GreyPanel className="justify-start gap-x-2 text14Medium text-textSecondary py-2.5 px-4 max-w-full">
      This account has no relationships with proxy, multisig and identity.
    </GreyPanel>
  );
}

export default function RelationshipPopup({
  title = "Relatives",
  className = "",
  onClose = noop,
  rootAddress = "",
}) {
  const { isLoading, nodes, edges } =
    useConversionRelationshipNode(rootAddress);

  const showNoRelationshipsTip = useMemo(() => {
    if (isLoading) {
      return false;
    }

    return nodes?.length === 1 && edges?.length === 0;
  }, [isLoading, nodes, edges]);

  return (
    <Popup
      className={cn("w-[960px]", className)}
      title={title}
      onClose={onClose}
    >
      <RelationshipProvider
        rootAddress={rootAddress}
        isLoading={isLoading}
        nodes={nodes}
        edges={edges}
      >
        {showNoRelationshipsTip && <NoRelationshipsTip />}
        <Relationship />
        <Indications />
      </RelationshipProvider>
    </Popup>
  );
}
