import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { AddressUser } from "next-common/components/user";
import FellowshipRank from "next-common/components/fellowship/rank";
import Divider from "next-common/components/styled/layout/divider";
import { IpfsEvidenceRawContent } from "next-common/components/collectives/core/evidenceContent";

export default function WishDetail({ activeMember, address, ifpsContent }) {
  return (
    <div className="gap-y-4 flex flex-col">
      <SecondaryCard className="flex items-center !p-4 ">
        <FellowshipRank rank={activeMember?.rank} />
        <AddressUser
          add={address}
          fontSize={22}
          className="ml-[0.625rem]"
          addressClassName="!text14Medium"
        />
      </SecondaryCard>

      <Divider />

      <IpfsEvidenceRawContent key="detail-content" value={ifpsContent} />
    </div>
  );
}
