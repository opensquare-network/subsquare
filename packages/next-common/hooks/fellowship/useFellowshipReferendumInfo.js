import { useOnchainData } from "next-common/context/post";
import { useSelector } from "react-redux";
import { fellowshipReferendumInfoSelector } from "next-common/store/reducers/fellowship/info";

export function useFellowshipReferendumInfo() {
  const onchain = useOnchainData();
  const infoOnStore = useSelector(fellowshipReferendumInfoSelector);

  return infoOnStore || onchain.info;
}

export function useFellowshipReferendumTally() {
  const info = useFellowshipReferendumInfo();
  return info?.tally;
}
