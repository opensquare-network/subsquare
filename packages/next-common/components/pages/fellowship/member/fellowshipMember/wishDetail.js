import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { AddressUser } from "next-common/components/user";
import FellowshipRank from "next-common/components/fellowship/rank";
import Divider from "next-common/components/styled/layout/divider";
import { IpfsEvidenceRawContent } from "next-common/components/collectives/core/evidenceContent";
import Avatar from "next-common/components/avatar";

export default function WishDetail({ activeMember, address, ifpsContent }) {
  return (
    <div className="gap-y-4 flex flex-col">
      <SecondaryCard className="flex items-center !p-4 ">
        <FellowshipRank rank={activeMember?.rank} />
        <div className="ml-[16px]">
          <Avatar address={address} size={32} />
        </div>
        <AddressUser
          add={address}
          className="text14Medium text-textPrimary ml-[12px]"
          showAvatar={false}
        />
      </SecondaryCard>

      <Divider />

      <IpfsEvidenceRawContent key="detail-content" value={ifpsContent} />
    </div>
  );
}
