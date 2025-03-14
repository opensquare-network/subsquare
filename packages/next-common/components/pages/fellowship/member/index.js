// fellowship member detail page
import { isAddress } from "@polkadot/util-crypto";
import useFellowshipMemberDetailAddr from "next-common/hooks/collectives/member/detail";
import NotFellowshipMember from "next-common/components/pages/notFellowshipMember";
import { usePageProps } from "next-common/context/page";
import { isSameAddress } from "next-common/utils";
import CollectivesProvider from "next-common/context/collectives/collectives";
import FellowshipMember from "./fellowshipMember";

function FellowshipMemberPageImpl() {
  const address = useFellowshipMemberDetailAddr();
  const { fellowshipMembers = [] } = usePageProps();

  if (!isAddress(address)) {
    return <NotFellowshipMember />;
  }

  const member = fellowshipMembers.find((m) =>
    isSameAddress(m.address, address),
  );

  if (!member) {
    return <NotFellowshipMember />;
  }

  return <FellowshipMember address={address} />;
}

export default function FellowshipMemberPage() {
  return (
    <CollectivesProvider section="fellowship">
      <FellowshipMemberPageImpl />
    </CollectivesProvider>
  );
}
