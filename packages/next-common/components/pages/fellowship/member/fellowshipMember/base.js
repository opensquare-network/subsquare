import Avatar from "next-common/components/avatar";
import CopyButton from "next-common/components/copyButton";
import AccountLinks from "next-common/components/links/accountLinks";
import FellowshipTagInfo from "next-common/components/profile/fellowshipTagInfo";
import {
  useCollectivesSection,
  useRankedCollectivePallet,
} from "next-common/context/collectives/collectives";
import { addressEllipsis } from "next-common/utils";
import MemberActiveStatus from "./memberActiveStatus";
import { AddressUser } from "next-common/components/user";

function Address({ address }) {
  return (
    <div className="flex items-center gap-[8px]">
      <span className="text12Medium text-textTertiary">
        {addressEllipsis(address)}
      </span>
      <CopyButton copyText={address} size={16} />
    </div>
  );
}

export default function MemberBaseInfo({ address }) {
  const section = useCollectivesSection();
  const pallet = useRankedCollectivePallet();

  return (
    <div className="flex flex-col items-center p-[24px] pt-[16px] gap-[16px] w-full">
      <Avatar address={address} size={56} />
      <div className="flex flex-col items-center gap-[4px] text-textPrimary">
        <AddressUser
          className="text16Bold text-textPrimary"
          showAvatar={false}
          add={address}
        />
        <Address address={address} />
        <AccountLinks address={address} />
      </div>
      <FellowshipTagInfo address={address} pallet={pallet} type={section} />
      <MemberActiveStatus address={address} />
    </div>
  );
}
