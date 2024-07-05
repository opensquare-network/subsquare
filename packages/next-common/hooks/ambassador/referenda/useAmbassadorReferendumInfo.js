import { useOnchainData } from "next-common/context/post";
import { useSelector } from "react-redux";
import { ambassadorReferendumInfoSelector } from "next-common/store/reducers/ambassador/info";

export function useAmbassadorReferendumInfo() {
  const onchain = useOnchainData();
  const infoOnStore = useSelector(ambassadorReferendumInfoSelector);

  return infoOnStore || onchain.info;
}

export function useAmbassadorReferendumTally() {
  const info = useAmbassadorReferendumInfo();
  return info?.tally;
}
