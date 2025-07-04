import { SystemRelatives } from "@osn/icons/subsquare";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import Tooltip from "next-common/components/tooltip";
import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";

const RelationshipPopup = dynamicPopup(() =>
  import("next-common/components/relationshipPopup"),
);

export default function CuratorTitle({ address }) {
  const [showRelationshipPopup, setShowRelationshipPopup] = useState(false);

  return (
    <TitleContainer className="mb-4 !px-0">
      <span>Curator</span>
      <Tooltip content="Check Relatives Detail">
        <SystemRelatives
          onClick={() => setShowRelationshipPopup(true)}
          className="w-5 h-5 cursor-pointer text-textTertiary"
        />
      </Tooltip>
      {showRelationshipPopup && (
        <RelationshipPopup
          onClose={() => setShowRelationshipPopup(false)}
          rootAddress={address}
        />
      )}
    </TitleContainer>
  );
}
