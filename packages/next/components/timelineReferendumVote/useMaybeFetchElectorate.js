import { useEffect, useState } from "react";
import extractVoteInfo from "next-common/utils/democracy/referendum";
import getElectorate from "next-common/utils/democracy/electorate";
import useChainOrScanHeight from "next-common/hooks/height";

export default function useMaybeFetchElectorate(
  referendum,
  referendumStatus,
  api,
) {
  const [electorate, setElectorate] = useState(0);
  const nowHeight = useChainOrScanHeight();

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
