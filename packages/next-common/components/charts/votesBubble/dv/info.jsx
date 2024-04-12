import Descriptions from "next-common/components/Descriptions";
import { InfoUsers, SystemVoteAye, SystemVoteNay } from "@osn/icons/subsquare";

function Label({ icon, label, percentage }) {
  return (
    <div className="flex justify-between items-center gap-x-2">
      {icon}

      <div className="flex items-center gap-x-1">
        <span className="text14Medium text-textPrimary">{label}</span>
        <span className="text14Medium text-textTertiary">({percentage})</span>
      </div>
    </div>
  );
}

export default function DVDetailInfo() {
  const descriptionsItems = [
    {
      label: (
        <Label
          icon={<InfoUsers className="w-5 h-5 text-textTertiary" />}
          label="Decentralized Voices"
          percentage={"24.72%"}
        />
      ),
      value: "TODO",
    },
    {
      label: (
        <Label
          icon={<SystemVoteAye className="w-5 h-5" />}
          label="Aye"
          percentage={"18.36%"}
        />
      ),
      value: "TODO",
    },
    {
      label: (
        <Label
          icon={<SystemVoteNay className="w-5 h-5" />}
          label="Nay"
          percentage={"6.36%"}
        />
      ),
      value: "TODO",
    },
  ];

  return <Descriptions items={descriptionsItems} />;
}
