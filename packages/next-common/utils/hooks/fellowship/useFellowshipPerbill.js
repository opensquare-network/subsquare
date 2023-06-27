import { useEffect, useState } from "react";
import useMaxVoters from "../../../hooks/fellowship/useMaxVoters";
import calcPerbill from "../../math/calcPerbill";
import { useFellowshipReferendumTally } from "next-common/hooks/fellowship/useFellowshipReferendumInfo";

export default function useFellowshipPerbill() {
  const tally = useFellowshipReferendumTally();
  const maxVoters = useMaxVoters();
  const [perbill, setPerbill] = useState(calcPerbill(tally.bareAyes, maxVoters));

  useEffect(() => {
    setPerbill(calcPerbill(tally.bareAyes, maxVoters));
  }, [tally, maxVoters]);

  return perbill;
}
