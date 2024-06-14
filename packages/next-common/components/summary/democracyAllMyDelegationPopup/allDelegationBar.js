import React, { useMemo, useState } from "react";
import styled from "styled-components";
import HStack from "next-common/components/styled/hStack";
import GreyInfoPanel from "../styled/greyInfoPanel";
import Tooltip from "next-common/components/tooltip";
import RemoveButton from "next-common/components/removeButton";
import {
  incMyReferendaDelegationsTrigger,
  myReferendaDelegationsSelector,
} from "next-common/store/reducers/myOnChainData/referenda/myReferendaDelegations";
import { useDispatch, useSelector } from "react-redux";
import useIsUseMetamask from "next-common/hooks/useIsUseMetamask";
import isMoonChain from "next-common/utils/isMoonChain";
import dynamic from "next/dynamic";

const UndelegateAllPopup = dynamic(
  () => import("../delegation/undelegateAllPopup"),
  {
    ssr: false,
  },
);

const MoonUndelegateAllPopup = dynamic(
  () => import("../delegation/undelegateAllPopup/moonPopup"),
  {
    ssr: false,
  },
);

const Count = styled.span`
  color: var(--textSecondary);
`;

export default function AllDelegationsBar() {
  const dispatch = useDispatch();
  const delegations = useSelector(myReferendaDelegationsSelector);
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isUseMetamask = useIsUseMetamask();

  let TheUndelegatePopup = UndelegateAllPopup;
  if (isMoonChain() && isUseMetamask) {
    TheUndelegatePopup = MoonUndelegateAllPopup;
  }

  const trackIds = useMemo(() => {
    return (delegations || []).map((item) => item.trackId);
  }, [delegations]);

  return (
    <>
      <HStack space={8}>
        <GreyInfoPanel>
          My delegation <Count>{delegations?.length || 0}</Count>
        </GreyInfoPanel>

        <Tooltip content="Remove all">
          <div>
            <RemoveButton
              disabled={!delegations?.length || isLoading}
              onClick={() => setShowPopup(true)}
            />
          </div>
        </Tooltip>
      </HStack>
      {showPopup && (
        <TheUndelegatePopup
          trackIds={trackIds}
          onClose={() => setShowPopup(false)}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          onInBlock={() => {
            dispatch(incMyReferendaDelegationsTrigger());
          }}
        />
      )}
    </>
  );
}
