// fellowship member detail page
import { isAddress } from "@polkadot/util-crypto";
import useFellowshipMemberDetailAddr from "next-common/hooks/collectives/member/detail";
import NotFellowshipMember from "next-common/components/pages/fellowship/member/notFellowshipMember";
import { usePageProps } from "next-common/context/page";
import { isSameAddress } from "next-common/utils";

export default function FellowshipMemberPage() {
  const address = useFellowshipMemberDetailAddr();
  const { fellowshipMembers = [] } = usePageProps();

  if (!isAddress(address)) {
    return <NotFellowshipMember />;
  }

  const member = fellowshipMembers.find((m) =>
    isSameAddress(m.address, address),
  );

  if (!member) {
    return `${address} is not a member`;
    // todo: show not member view
  } else {
    return `${address} is a member`;
    // todo: show member view
  }
}
