import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import extractVoteInfo from "next-common/utils/democracy/referendum";
import getElectorate from "next-common/utils/democracy/electorate";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";

export default function useMaybeFetchElectorate(
  referendum,
  referendumStatus,
  api,
) {
  const [electorate, setElectorate] = useState(0);
  const nowHeight = useSelector(chainOrScanHeightSelector);

  const { voteFinishedHeight } = extractVoteInfo(referendum?.timeline);
  const possibleElectorate = referendumStatus?.tally?.electorate;

  useEffect(() => {
    if (possibleElectorate) {
      setElectorate(possibleElectorate);
    } else if (api) {
      const height = voteFinishedHeight || nowHeight;
      getElectorate(api, height).then((electorate) =>
        setElectorate(electorate),
      );
    }
  }, [api, voteFinishedHeight, nowHeight, possibleElectorate]);

  return electorate;
}
