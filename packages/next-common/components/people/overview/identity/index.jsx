import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import Tabs from "next-common/components/tabs";
import DirectIdentityImpl from "./directIdentity";
import useSubMyIdentityInfo from "next-common/hooks/people/useSubMyIdentityInfo";
import useTabNavigation from "../hooks/useTabNavigation";

export default function PeopleOverviewIdentity() {
  const { activeTabValue, handleTabClick } = useTabNavigation("direct-identity");
  const { result: subMyIdentityInfo, isLoading } = useSubMyIdentityInfo();

  const isEmpty =
    Object.values(subMyIdentityInfo ?? {}).filter(Boolean).length === 0;

  const tabs = [
    {
      value: "direct-identity",
      label: "Direct Identity",
      content: (
        <DirectIdentityImpl
          isEmpty={isEmpty}
          identityInfo={subMyIdentityInfo}
          isLoading={isLoading}
        />
      ),
    },
    // {
    //   value: "sub-identities",
    //   label: "Sub Identities",
    //   content: <SubIdentitiesImpl isEmpty={isEmpty} />,
    // },
  ];

  return (
    <SecondaryCardDetail>
      <Tabs
        activeTabValue={activeTabValue}
        onTabClick={handleTabClick}
        tabs={tabs}
      />
    </SecondaryCardDetail>
  );
}
