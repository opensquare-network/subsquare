import FellowshipCoreInductionPopup from "next-common/components/fellowship/core/summary/induct/popup";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { fellowshipCollectiveMembersSelector } from "next-common/store/reducers/fellowship/collective";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { isSameAddress } from "next-common/utils";
import SecondaryButton from "next-common/lib/button/secondary";
import { SystemPlus } from "@osn/icons/subsquare";

/**
 * @param {ButtonProps} props
 */
export default function Induct(props = {}) {
  const [showPopup, setShowPopup] = useState(false);
  const members = useSelector(fellowshipCollectiveMembersSelector);
  const realAddress = useRealAddress();

  const canInduct = useMemo(() => {
    const found = (members || []).find((m) =>
      isSameAddress(m.address, realAddress),
    );
    return found && found.rank >= 3;
  }, [members, realAddress]);

  return (
    <>
      <SecondaryButton
        size="small"
        disabled={!canInduct}
        onClick={() => setShowPopup(true)}
        iconLeft={<SystemPlus className="inline-flex w-4 h-4 text-current" />}
        {...props}
      >
        Induct
      </SecondaryButton>
      {showPopup && (
        <FellowshipCoreInductionPopup onClose={() => setShowPopup(false)} />
      )}
    </>
  );
}
