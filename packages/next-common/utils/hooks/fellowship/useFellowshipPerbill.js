import useFellowshipTally from "../../../hooks/fellowship/useFellowshipTally";
import { useEffect, useState } from "react";
import useMaxVoters from "../../../hooks/fellowship/useMaxVoters";
import calcPerbill from "../../math/calcPerbill";

export default function useFellowshipPerbill() {
  const tally = useFellowshipTally();
  const maxVoters = useMaxVoters();
  const [perbill, setPerbill] = useState(calcPerbill(tally.bareAyes, maxVoters));

  useEffect(() => {
    setPerbill(calcPerbill(tally.bareAyes, maxVoters));
  }, [tally, maxVoters]);

  return perbill;
}
