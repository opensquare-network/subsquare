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
import SubIdentitiesTable from "./subTable";
import useSubMyIdentityInfo from "next-common/hooks/people/useSubMyIdentityInfo";
import tw from "tailwind-styled-components";
import RightWrapper from "next-common/components/rightWraper";
const SetIdentityPopup = dynamicPopup(
  () => import("next-common/components/setIdentityPopup"),
  {
    ssr: false,
  },
);

const RequestJudgementPopup = dynamicPopup(
  () => import("next-common/components/requestJudgementPopup"),
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
      content: <DirectIdentityImpl />,
    },
    {
      value: "sub-identities",
      label: "Sub Identities",
      content: <SubIdentitiesTable />,
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

function DirectIdentityImpl() {
  const { result: subMyIdentityInfo } = useSubMyIdentityInfo();

  const isEmpty =
    Object.values(subMyIdentityInfo ?? {}).filter(Boolean).length === 0;
  if (!isEmpty) {
    return <DirectIdentity subMyIdentityInfo={subMyIdentityInfo} />;
  }
  return <DirectIdentityEmpty />;
}

export function DirectIdentityEmpty() {
  const [showSetIdentityPopup, setShowSetIdentityPopup] = useState(false);
  return (
    <div className="space-y-4">
      <GreyPanel className="px-4 py-2.5 text14Medium text-textSecondary">
        No identity is set for the connected account.
      </GreyPanel>
      <RightWrapper>
        <PrimaryButton
          className="w-auto"
          onClick={() => setShowSetIdentityPopup(true)}
        >
          Set Identity
        </PrimaryButton>
      </RightWrapper>

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

export function DirectIdentity({ subMyIdentityInfo }) {
  const [showSetIdentityPopup, setShowSetIdentityPopup] = useState(false);
  const [showRequestJudgementPopup, setShowRequestJudgementPopup] =
    useState(false);

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
      <PropList subMyIdentityInfo={subMyIdentityInfo} />
      <Divider className="my-4" />
      <RightWrapper>
        <SecondaryButton
          className="w-auto"
          onClick={() => setShowRequestJudgementPopup(true)}
        >
          Request Judgement
        </SecondaryButton>
      </RightWrapper>
      {showRequestJudgementPopup && (
        <RequestJudgementPopup
          onClose={() => setShowRequestJudgementPopup(false)}
        />
      )}
    </>
  );
}

const PropListWrapper = tw.div`
space-y-2 ml-14
`;

const PropListLabel = tw.div`
text14Medium text-textTertiary w-60
`;

const PropListValue = tw.div`
text14Medium text-textPrimary
`;

function PropList({ subMyIdentityInfo }) {
  const list = [
    { label: "Display Name", valueKey: "display" },
    { label: "Legal Name", valueKey: "legal" },
    { label: "Email", valueKey: "email" },
    { label: "Website", valueKey: "web" },
    { label: "Twitter", valueKey: "twitter" },
    { label: "Discord", valueKey: "discord" },
    { label: "Matrix Name", valueKey: "matrix" },
    { label: "Github Name", valueKey: "github" },
  ];
  return (
    <PropListWrapper className="space-y-2 ml-14">
      {list.map((item) => (
        <div key={item.label} className="flex">
          <PropListLabel>{item.label}</PropListLabel>
          <PropListValue>
            {subMyIdentityInfo[item.valueKey] ?? "-"}
          </PropListValue>
        </div>
      ))}
    </PropListWrapper>
  );
}
