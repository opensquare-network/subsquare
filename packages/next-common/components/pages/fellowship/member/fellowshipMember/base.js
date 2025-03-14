import Avatar from "next-common/components/avatar";
import CopyButton from "next-common/components/copyButton";
import Identity from "next-common/components/Identity";
import AccountLinks from "next-common/components/links/accountLinks";
import FellowshipTagInfo from "next-common/components/profile/fellowshipTagInfo";
import {
  useCollectivesSection,
  useRankedCollectivePallet,
} from "next-common/context/collectives/collectives";
import useIdentityInfo from "next-common/hooks/useIdentityInfo";
import { addressEllipsis } from "next-common/utils";

export default function MemberBaseInfo({ address }) {
  const { identity } = useIdentityInfo(address);
  const section = useCollectivesSection();
  const pallet = useRankedCollectivePallet();

  return (
    <div className="flex flex-col items-center p-[24px] pt-[16px] gap-[16px]">
      <Avatar address={address} size={56} />
      <div className="flex flex-col items-center gap-[4px]">
        <Identity identity={identity} />
        <div className="flex items-center gap-[8px]">
          <span className="text12Medium text-textTertiary">
            {addressEllipsis(address)}
          </span>
          <CopyButton copyText={address} size={16} />
        </div>
        <AccountLinks address={address} />
      </div>
      <FellowshipTagInfo address={address} pallet={pallet} type={section} />
    </div>
  );
}
