import { usePageProps } from "next-common/context/page";
import { toPercentage } from "next-common/utils";
import Tooltip from "../../tooltip";

function Participation({ data }) {
  const { gov2ReferendaSummary } = usePageProps();

  return (
    <Tooltip
      content={
        <span className="text12Medium">
          {data.votesCount}/{gov2ReferendaSummary.total}
        </span>
      }
      className="hover:underline"
    >
      {toPercentage(data.participationRate, 1).toFixed(1)}%
    </Tooltip>
  );
}

export const participationCol = {
  name: "Participation",
  width: 120,
  className: "text-right",
  cellRender(data) {
    return <Participation data={data} />;
  },
};
