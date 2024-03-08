import useTipIsFinished from "./isFinished";
import { useOnchainData } from "../../index";
import { useEffect, useState } from "react";
import useCouncilMembers from "../../../../utils/hooks/useCouncilMembers";
import { floor } from "lodash-es";

function calcTipThreshold(length = 0) {
  return floor((length + 1) / 2);
}

export default function useTipThreshold() {
  const onchain = useOnchainData();
  const isFinished = useTipIsFinished();
  const members = useCouncilMembers();

  const [count, setCount] = useState(calcTipThreshold(onchain.tippersCount));
  useEffect(() => {
    if (!isFinished && members) {
      setCount(calcTipThreshold(members.length));
    }
  }, [members, isFinished]);

  return count;
}
