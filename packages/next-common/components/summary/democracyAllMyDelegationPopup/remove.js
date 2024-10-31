import RemoveButton from "next-common/components/removeButton";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import {
  incMyReferendaDelegationsTrigger,
} from "next-common/store/reducers/myOnChainData/referenda/myReferendaDelegations";
import Tooltip from "next-common/components/tooltip";
import dynamicPopup from "next-common/lib/dynamic/popup";
import getChainSettings from "next-common/utils/consts/settings";
import { defaultBlockTime } from "next-common/utils/constants";
import { sleep } from "next-common/utils";

const UndelegatePopup = dynamicPopup(() =>
  import("../delegation/undelegatePopup"),
);

export default function RemoveDelegation({ trackId }) {
  const dispatch = useDispatch();
  const [showPopup, setShowPopup] = useState(false);

  const updateDelegationsFn = useCallback(async () => {
    const blockTime =
      getChainSettings(process.env.NEXT_PUBLIC_CHAIN).blockTime ||
      defaultBlockTime;

    for (let i = 0; i < 3; i++) {
      dispatch(incMyReferendaDelegationsTrigger());
      await sleep(blockTime);
    }
  }, [dispatch]);

  return (
    <>
      <Tooltip content={"Remove"}>
        <RemoveButton onClick={() => setShowPopup(true)} />
      </Tooltip>
      {showPopup && (
        <UndelegatePopup
          trackId={trackId}
          onClose={() => setShowPopup(false)}
          onInBlock={updateDelegationsFn}
        />
      )}
    </>
  );
}
