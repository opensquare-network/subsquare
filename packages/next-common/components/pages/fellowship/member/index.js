// fellowship member detail page
import useFellowshipMemberDetailAddr from "next-common/hooks/collectives/member/detail";
import { usePageProps } from "next-common/context/page";
import { isSameAddress } from "next-common/utils";

export default function FellowshipMemberPage() {
  const address = useFellowshipMemberDetailAddr();
  const { fellowshipMembers = [] } = usePageProps();
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
