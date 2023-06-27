import { useOnchainData } from "next-common/context/post";
import { useSelector } from "react-redux";
import { referendumInfoSelector } from "next-common/store/reducers/referenda/info";

export function useReferendumInfo() {
  const onchain = useOnchainData();
  const infoOnStore = useSelector(referendumInfoSelector);

  return infoOnStore || onchain.info;
}

export function useReferendumTally() {
  const info = useReferendumInfo();
  return info?.tally;
}
