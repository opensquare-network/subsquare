import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import { MenuDelegation } from "@osn/icons/subsquare";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import PrimaryButton from "next-common/lib/button/primary";
import { SystemPlus } from "@osn/icons/subsquare";
import { useState } from "react";
import Divider from "next-common/components/styled/layout/divider";
import { MarkdownPreviewer } from "@osn/previewer";
import { useDelegationGuideContext } from "./context/DelegationGuideContext";
import useProfileAddress from "next-common/components/profile/useProfileAddress";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { cn } from "next-common/utils";
import { useIsMobile } from "next-common/components/overview/accountInfo/components/accountBalances";

const ReferendaDelegatePopup = dynamicPopup(() =>
  import("next-common/components/gov2/delegatePopup"),
);

const DemocracyDelegatePopup = dynamicPopup(() =>
  import("next-common/components/democracy/delegatePopup"),
);

function TargetDelegatePopup({ setShowDelegatePopup }) {
  const { pallet } = useDelegationGuideContext();
  const defaultTargetAddress = useProfileAddress();

  if (!pallet) {
    return null;
  }

  if (pallet === "referenda") {
    return (
      <ReferendaDelegatePopup
        defaultTargetAddress={defaultTargetAddress}
        onClose={() => setShowDelegatePopup(false)}
      />
    );
  }

  return (
    <DemocracyDelegatePopup
      defaultTargetAddress={defaultTargetAddress}
      onClose={() => setShowDelegatePopup(false)}
    />
  );
}

function DelegateAction() {
  const isMobile = useIsMobile();
  const [showDelegatePopup, setShowDelegatePopup] = useState(false);

  return (
    <div className={cn(isMobile && "w-full flex justify-end")}>
      <PrimaryButton
        className="p-2 pr-4"
        onClick={() => setShowDelegatePopup(true)}
      >
        <SystemPlus className="w-6 h-6 [&_path]:fill-textPrimaryContrast mr-2" />
        Delegate
      </PrimaryButton>
      {showDelegatePopup && (
        <TargetDelegatePopup setShowDelegatePopup={setShowDelegatePopup} />
      )}
    </div>
  );
}

function PanelPrefix() {
  return (
    <div className="w-10 h-10 rounded-lg bg-theme100 p-2">
      <MenuDelegation className="text-theme500" />
    </div>
  );
}

function PanelHeader({ subTitle }) {
  return (
    <div>
      <TitleContainer className="text14Bold px-0">
        Delegation Announcement
      </TitleContainer>
      <div className="w-auto flex grow flex-wrap text-textTertiary">
        {subTitle || "-"}
      </div>
    </div>
  );
}

function PanelLongDescription({ description }) {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="space-y-4 mt-4">
      {!showMore && (
        <div
          role="button"
          className="text12Medium text-theme500"
          onClick={() => setShowMore(true)}
        >
          Show More
        </div>
      )}
      {showMore && (
        <>
          <Divider />
          <MarkdownPreviewer
            content={description}
            markedOptions={{
              breaks: true,
            }}
          />
        </>
      )}
      {showMore && (
        <div
          role="button"
          className="text12Medium text-theme500"
          onClick={() => setShowMore(false)}
        >
          Show Less
        </div>
      )}
    </div>
  );
}

function PanelContent() {
  const { data } = useDelegationGuideContext();

  return (
    <div className="text14Medium text-textSecondary flex-1">
      <PanelHeader subTitle={data?.shortDescription} />
      {data?.longDescription && (
        <PanelLongDescription description={data?.longDescription} />
      )}
    </div>
  );
}

export default function DelegationGuidePanel() {
  const isMobile = useIsMobile();

  return (
    <GreyPanel
      className={cn(
        "max-w-full p-6",
        "text14Medium text-textSecondary",
        "flex-row justify-start !items-start gap-x-3",
        "bg-neutral100 border border-neutral300 rounded-lg shadow-100 outline-theme500",
        isMobile && "flex-col gap-y-3",
      )}
    >
      <PanelPrefix />
      <PanelContent />
      <DelegateAction />
    </GreyPanel>
  );
}
