import { useChainSettings } from "next-common/context/chain";
import BaseLayout from "next-common/components/layout/baseLayout";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import NoWalletConnected from "next-common/components/assets/noWalletConnected";
import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import { AccountImpl } from "next-common/components/layout/AccountLayout";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import Tabs from "next-common/components/tabs";
import { useState } from "react";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import PrimaryButton from "next-common/lib/button/primary";
import SecondaryButton from "next-common/lib/button/secondary";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { Account } from "next-common/components/overview/accountInfo/accountInfoPanel";
import { cn } from "next-common/utils";
import { SystemEdit2, SystemClose } from "@osn/icons/subsquare";
import Divider from "next-common/components/styled/layout/divider";

const SetIdentityPopup = dynamicPopup(
  () => import("next-common/components/setIdentityPopup"),
  {
    ssr: false,
  },
);

export default function PeopleOverviewPageImpl() {
  const { description } = useChainSettings();
  const realAddress = useRealAddress();

  if (!realAddress) {
    return <NoWalletConnected />;
  }
  return (
    <BaseLayout title="Identities" description={description}>
      <PeopleOverviewContent />
    </BaseLayout>
  );
}

function PeopleOverviewContent() {
  const [activeTabValue, setActiveTabValue] = useState("direct-identity");

  const tabs = [
    {
      value: "direct-identity",
      label: "Direct Identity",
      content: <DirectIdentity />,
    },
    {
      value: "sub-identities",
      label: "Sub Identities",
      content: <SubIdentityEmpty />,
    },
  ];

  function handleTabClick(tab) {
    setActiveTabValue(tab.value);
  }

  return (
    <div className="space-y-6">
      <AccountImpl>
        <TitleContainer className="mb-4">Identity</TitleContainer>
        <SecondaryCardDetail>
          <Tabs
            activeTabValue={activeTabValue}
            onTabClick={handleTabClick}
            tabs={tabs}
          />
        </SecondaryCardDetail>
      </AccountImpl>
    </div>
  );
}

export function DirectIdentityEmpty() {
  const [showSetIdentityPopup, setShowSetIdentityPopup] = useState(false);
  return (
    <div className="space-y-4">
      <GreyPanel className="px-4 py-2.5 text14Medium text-textSecondary">
        No identity is set for the connected account.
      </GreyPanel>
      <PrimaryButton
        className="w-auto"
        onClick={() => setShowSetIdentityPopup(true)}
      >
        Set Identity
      </PrimaryButton>
      {showSetIdentityPopup && (
        <SetIdentityPopup onClose={() => setShowSetIdentityPopup(false)} />
      )}
    </div>
  );
}

export function SubIdentityEmpty() {
  return (
    <div className="space-y-4">
      <GreyPanel className="px-4 py-2.5 text14Medium text-textSecondary">
        Please set direct identity first.
      </GreyPanel>
    </div>
  );
}

export function DirectIdentity() {
  const [showSetIdentityPopup, setShowSetIdentityPopup] = useState(false);

  return (
    <>
      <div className="flex justify-between gap-2">
        <Account />
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex justify-center items-center",
              "bg-neutral100 border border-neutral400 rounded-md w-[28px] h-[28px]",
              "cursor-pointer",
            )}
            onClick={() => setShowSetIdentityPopup(true)}
          >
            <SystemEdit2 className="w-[16px] h-[16px]" />
          </div>
          <div
            className={cn(
              "flex justify-center items-center",
              "bg-neutral100 border border-neutral400 rounded-md w-[28px] h-[28px]",
              "cursor-pointer",
            )}
          >
            <SystemClose className="w-[16px] h-[16px]" />
          </div>
        </div>
      </div>

      {showSetIdentityPopup && (
        <SetIdentityPopup onClose={() => setShowSetIdentityPopup(false)} />
      )}
      <Divider className="my-4" />
      <PropList />
      <Divider className="my-4" />
      <div className="flex justify-end">
        <SecondaryButton className="w-auto">Request Judgement</SecondaryButton>
      </div>
    </>
  );
}

function PropList() {
  const list = [
    { label: "Display Name", value: "-" },
    { label: "Legal Name", value: "-" },
    { label: "Email", value: "-" },
    { label: "Website", value: "-" },
    { label: "Twitter", value: "-" },
    { label: "Discord", value: "-" },
    { label: "Matrix Name", value: "-" },
    { label: "Github Name", value: "-" },
  ];
  return (
    <div className="space-y-2 ml-14">
      {list.map((item) => (
        <div key={item.label} className="flex">
          <div className="text14Medium text-textTertiary w-60">
            {item.label}
          </div>
          <div className="text14Medium text-textPrimary">{item.value}</div>
        </div>
      ))}
    </div>
  );
}
