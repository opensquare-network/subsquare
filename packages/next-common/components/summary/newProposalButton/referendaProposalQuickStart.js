import { useMemo, useState } from "react";
import {
  ArrowDown,
  InfoPopoular,
  SystemNewProposal,
} from "@osn/icons/subsquare";
import { useChainSettings } from "next-common/context/chain";
import SecondaryButton from "next-common/lib/button/secondary";
import Divider from "next-common/components/styled/layout/divider";
import { useStepContainer } from "next-common/context/stepContainer";
import { ChoiceButton } from "next-common/components/summary/newProposalButton/common";
import { NewRemarkReferendumInnerPopupContent } from "../newProposalQuickStart/createSystemRemarkProposalPopup";
import { CancelReferendumInnerPopupContent } from "../newProposalQuickStart/cancelReferendumInnerPopup";
import { KillReferendumInnerPopupContent } from "../newProposalQuickStart/killReferendumInnerPopup";
import { NewTreasuryReferendumInnerPopupContent } from "../newProposalQuickStart/createTreasuryProposalPopup";
import { NewUSDxTreasuryReferendumInnerPopupContent } from "../newProposalQuickStart/createUSDxTreasuryProposalPopup";
import { SpendDotOnAssetHubReferendumInnerPopupContent } from "../newProposalQuickStart/spendDotOnAssetHubPopup";

const useQuickStartItems = () => {
  const {
    treasuryProposalTracks,
    newProposalQuickStart: {
      usdxTreasuryProposal,
      spendDotOnAssetHubProposal,
      cancelReferendum,
      killReferendum,
    } = {},
  } = useChainSettings();

  return useMemo(() => {
    const items = [
      {
        name: "Treasury proposal local",
        description:
          "Create a treasury spend of native token that is locally available",
        content: NewTreasuryReferendumInnerPopupContent,
      },
    ];
    if (treasuryProposalTracks && usdxTreasuryProposal) {
      items.push({
        name: "USDx treasury proposal",
        description: "Create a treasury spend with assets on AssetHub",
        buttonSuffix: <InfoPopoular className="w-4 h-4 ml-2" />,
        content: NewUSDxTreasuryReferendumInnerPopupContent,
      });
    }
    if (treasuryProposalTracks && spendDotOnAssetHubProposal) {
      items.push({
        name: "Spend DOT on AssetHub",
        description: "Create a treasury spend with DOT asset on AssetHub",
        content: SpendDotOnAssetHubReferendumInnerPopupContent,
      });
    }
    items.push({
      name: "Remark",
      description: "Create a remark proposal",
      content: NewRemarkReferendumInnerPopupContent,
    });
    if (cancelReferendum) {
      items.push({
        name: "Cancel a referendum",
        description: "Cancel an ongoing referendum and returning the deposit",
        content: CancelReferendumInnerPopupContent,
      });
    }
    if (killReferendum) {
      items.push({
        name: "Kill a referendum",
        description:
          "Kill an ongoing referendum and the submission & decision deposits will be slashed",
        content: KillReferendumInnerPopupContent,
      });
    }

    return {
      firstFourTemplates: items.slice(0, 4),
      moreTemplates: items.slice(4),
    };
  }, [
    cancelReferendum,
    killReferendum,
    spendDotOnAssetHubProposal,
    treasuryProposalTracks,
    usdxTreasuryProposal,
  ]);
};

const ItemButton = ({ templateData }) => {
  const { content, name, description, icon, buttonSuffix } = templateData;
  const { goNext } = useStepContainer();
  return (
    <ChoiceButton
      name={name}
      description={description}
      icon={icon || <SystemNewProposal className="text-textTertiary" />}
      buttonSuffix={buttonSuffix}
      onClick={() => {
        goNext({
          title: name,
          component: content,
        });
      }}
    />
  );
};

export default function ReferendaProposalQuickStart() {
  const { firstFourTemplates, moreTemplates } = useQuickStartItems();
  const [showMore, setShowMore] = useState(false);
  return (
    <>
      <div className="flex flex-col !mt-[16px] ">
        <h6 className="text-textPrimary text14Bold pb-3">Quick Start</h6>
        <div className="flex flex-col gap-3">
          {firstFourTemplates.map((templateData) => (
            <ItemButton key={templateData.name} templateData={templateData} />
          ))}
        </div>
      </div>
      {moreTemplates.length ? (
        <>
          <div className="flex items-center justify-center w-full gap-4 my-4">
            <Divider className="flex-1" />
            <SecondaryButton
              size="small"
              onClick={() => {
                setShowMore(!showMore);
              }}
              iconRight={
                <ArrowDown
                  className={`${
                    showMore ? "rotate-180" : ""
                  } w-4 h-4 text-textTertiary`}
                />
              }
            >
              More Templates
            </SecondaryButton>
            <Divider className="flex-1" />
          </div>
          {showMore ? (
            <div className="flex flex-col gap-3">
              {moreTemplates.map((templateData) => (
                <ItemButton
                  key={templateData.name}
                  templateData={templateData}
                />
              ))}
            </div>
          ) : null}
        </>
      ) : null}
    </>
  );
}
