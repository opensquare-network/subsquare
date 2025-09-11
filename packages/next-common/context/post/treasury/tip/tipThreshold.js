import useTipIsFinished from "./isFinished";
import { useOnchainData } from "../../index";
import { useEffect, useState } from "react";
import { floor } from "lodash-es";
import useCollectiveMembers from "next-common/utils/hooks/collectives/useCollectiveMembers";

function calcTipThreshold(length = 0) {
  return floor((length + 1) / 2);
}

export default function useTipThreshold() {
  const onchain = useOnchainData();
  const isFinished = useTipIsFinished();
  const { members } = useCollectiveMembers();

  const [count, setCount] = useState(calcTipThreshold(onchain.tippersCount));
  useEffect(() => {
    if (!isFinished && members) {
      setCount(calcTipThreshold(members.length));
    }
  }, [members, isFinished]);

  return count;
}
