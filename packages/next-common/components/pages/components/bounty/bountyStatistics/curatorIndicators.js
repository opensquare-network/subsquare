import { AddressUser } from "next-common/components/user";
import { formatNum } from "next-common/utils";
import { useState } from "react";
import CuratorProposalsPopup from "./curatorDetailPopup";
import { usePost } from "next-common/context/post";

export default function CuratorIndicators({ data, curators = [] }) {
  const post = usePost();
  const [showDetail, setShowDetail] = useState(false);
  const [proposals, setProposals] = useState([]);
  const [totalFiat, setTotalFiat] = useState(0);

  if (!data) {
    return null;
  }

  const { labels, datasets } = data;
  const { name, backgroundColor, data: fiatAtFinals } = datasets[0];

  return (
    <div className="flex flex-1 flex-col gap-y-2 justify-center text12Medium">
      {labels.map((label, index) => (
        <div
          key={index}
          role="button"
          className="flex justify-between items-center cursor-pointer hover:underline"
          onClick={() => {
            setShowDetail(true);
            const curator = curators.find((item) => item.address === label);
            const proposals = curator.childBounties || [];
            setProposals(
              proposals.map((item) => `${post?.bountyIndex}_${item}`),
            );
            setTotalFiat(curator.totalPayoutFiatValue);
          }}
        >
          <div
            className="flex items-center"
            title={`${name[index]} ${formatNum(fiatAtFinals[index])}`}
          >
            <span
              className="w-[12px] h-[12px] rounded-[2px] inline-block mr-2"
              style={{ backgroundColor: backgroundColor[index] }}
            />
            <span className="text-textPrimary">
              <AddressUser
                noEvent={true}
                add={curators?.[index]?.nameAbbr ?? name[index]}
                className="text12Medium"
              />
            </span>
            <span className="text-textPrimary ml-1">
              {formatNum(fiatAtFinals[index])}
            </span>
          </div>
        </div>
      ))}
      {showDetail && (
        <CuratorProposalsPopup
          proposals={proposals}
          totalFiat={totalFiat}
          onClose={() => setShowDetail(false)}
        />
      )}
    </div>
  );
}
