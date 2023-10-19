import React, { useMemo, useState } from "react";
import styled from "styled-components";
import BaseVotesPopup from "next-common/components/popup/baseVotesPopup";
import VStack from "next-common/components/styled/vStack";
import AllMyDelegationPopupList from "next-common/components/summary/democracyAllMyDelegationPopup/list";
import noop from "lodash.noop";
import HStack from "next-common/components/styled/hStack";
import GreyInfoPanel from "../styled/greyInfoPanel";
import Tooltip from "next-common/components/tooltip";
import RemoveButton from "next-common/components/removeButton";
import {
  incMyReferendaDelegationsTrigger,
  myReferendaDelegationsSelector,
} from "next-common/store/reducers/myOnChainData/referenda/myReferendaDelegations";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import useIsUseMetamask from "next-common/hooks/useIsUseMetamask";
import isMoonChain from "next-common/utils/isMoonChain";
import UndelegateAllPopup from "../delegation/undelegateAllPopup";
import MoonUndelegateAllPopup from "../delegation/undelegateAllPopup/moonPopup";

const StyledPopup = styled(BaseVotesPopup)`
  width: 610px;
`;

const Count = styled.span`
  color: var(--textSecondary);
`;

function AllDelegationsBar() {
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

        <Tooltip content="Remove all delegations">
          <div>
            <RemoveButton
              disabled={!delegations?.length}
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

export default function AllMyDelegationPopup({ setShow = noop }) {
  return (
    <StyledPopup title="My Delegation" onClose={() => setShow(false)}>
      <VStack space={16}>
        <AllDelegationsBar />
        <AllMyDelegationPopupList />
      </VStack>
    </StyledPopup>
  );
}
