import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import extractVoteInfo from "next-common/utils/democracy/referendum";
import { nowHeightSelector } from "next-common/store/reducers/chainSlice";
import getKintElectorate from "next-common/utils/democracy/electorate/kintsugi";
import getElectorate from "next-common/utils/democracy/electorate";
import Chains from "next-common/utils/consts/chains";

export default function useMaybeFetchElectorate(
  referendum,
  referendumStatus,
  api
) {
  const [electorate, setElectorate] = useState(0);
  const nowHeight = useSelector(nowHeightSelector);

  const { voteFinishedHeight } = extractVoteInfo(referendum?.timeline);
  const possibleElectorate = referendumStatus?.tally?.electorate;

  useEffect(() => {
    if (possibleElectorate) {
      setElectorate(possibleElectorate);
    } else if (api) {
      const height = voteFinishedHeight || nowHeight;
      if ([Chains.kintsugi, Chains.interlay].includes(process.env.CHAIN)) {
        getKintElectorate(api, height).then((electorate) =>
          setElectorate(electorate)
        );
      } else {
        getElectorate(api, height).then((electorate) =>
          setElectorate(electorate)
        );
      }
    }
  }, [api, voteFinishedHeight, nowHeight, possibleElectorate]);

  return electorate;
}
