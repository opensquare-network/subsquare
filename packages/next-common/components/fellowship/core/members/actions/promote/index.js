import { useSelector } from "react-redux";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { usePageProps } from "next-common/context/page";

export default function Promote({ member }) {
  const { rank, status: { lastPromotion } = {} } = member;

  const latestHeight = useSelector(chainOrScanHeightSelector);
  const { fellowshipParams } = usePageProps();
  const index = rank > 0 ? rank - 1 : 0;
  const promotionPeriod = fellowshipParams.minPromotionPeriod[index];

  const gone = latestHeight - lastPromotion;
  const canPromote = gone >= promotionPeriod;

  if (!canPromote) {
    return <span className="text14Medium text-textDisabled">Promote↗</span>;
  }

  return (
    <span className="text14Medium text-theme500 cursor-pointer">Promote↗</span>
  );
}
