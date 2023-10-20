import flexBetweenCenter from "next-common/components/styled/flexBetweenCenter";
import styled from "styled-components";
import { useAllBeenDelegatedList } from "next-common/utils/hooks/referenda/useAllBeenDelegatedList";
import { Button } from "next-common/components/summary/styled";
import VStackOrigin from "next-common/components/styled/vStack";
import AddSVG from "next-common/assets/imgs/icons/add.svg";
import HStack from "next-common/components/styled/hStack";
import Flex from "next-common/components/styled/flex";
import GreyInfoPanel from "next-common/components/summary/styled/greyInfoPanel";
import ListSVG from "next-common/assets/imgs/icons/list.svg";
import Tooltip from "next-common/components/tooltip";
import DelegatePopup from "components/gov2/delegatePopup";
import MoonDelegatePopup from "components/gov2/delegatePopup/moonPopup";
import { useCallback, useState } from "react";
import AllMyDelegationPopup from "next-common/components/summary/democracyAllMyDelegationPopup";
import AllBeenDelegatedListPopup from "next-common/components/summary/democracyAllBeenDelegatedPopup";
import { clearVotingForEntries } from "next-common/utils/gov2/gov2ReferendumVote";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import { useDispatch, useSelector } from "react-redux";
import { useChainSettings } from "next-common/context/chain";
import isMoonChain from "next-common/utils/isMoonChain";
import useIsUseMetamask from "next-common/hooks/useIsUseMetamask";
import useFetchMyReferendaDelegations from "next-common/utils/hooks/referenda/useFetchMyReferendaDelegations";
import {
  incMyReferendaDelegationsTrigger,
  myReferendaDelegationsSelector,
} from "next-common/store/reducers/myOnChainData/referenda/myReferendaDelegations";

const Wrapper = styled(flexBetweenCenter)`
  gap: 8px;
  flex-wrap: wrap;
`;

const VStack = styled(VStackOrigin)`
  flex: 1;
`;

const ButtonWrapper = styled(Flex)`
  justify-content: flex-end;
`;

const Count = styled.span`
  color: var(--textSecondary);
`;

const ListButton = styled(Button)`
  padding: 7px;
`;

export default function AllDelegation() {
  const dispatch = useDispatch();
  useFetchMyReferendaDelegations();
  const delegations = useSelector(myReferendaDelegationsSelector);
  const { beenDelegatedList } = useAllBeenDelegatedList();
  const { hideActionButtons } = useChainSettings();

  const [showDelegatePopup, setShowDelegatePopup] = useState(false);
  const [showAllMyDelegationPopup, setShowAllMyDelegationPopup] =
    useState(false);
  const [showAllBeenDelegatedPopup, setShowAllBeenDelegatedPopup] =
    useState(false);
  const isUseMetamask = useIsUseMetamask();

  const onDelegateInBlock = useCallback(() => {
    clearVotingForEntries();
    dispatch(incMyReferendaDelegationsTrigger());
    dispatch(newSuccessToast("Delegate success"));
  }, [dispatch]);

  let Popup = DelegatePopup;
  if (isMoonChain() && isUseMetamask) {
    Popup = MoonDelegatePopup;
  }

  return (
    <Wrapper>
      <VStack space={8}>
        {showDelegatePopup && (
          <Popup
            onInBlock={onDelegateInBlock}
            onClose={() => setShowDelegatePopup(false)}
          />
        )}

        {!!delegations?.length && (
          <>
            <HStack space={8}>
              <GreyInfoPanel>
                My delegation <Count>{delegations.length}</Count>
              </GreyInfoPanel>

              <Tooltip content="My delegation detail">
                <div>
                  <ListButton onClick={() => setShowAllMyDelegationPopup(true)}>
                    <ListSVG />
                  </ListButton>
                </div>
              </Tooltip>
            </HStack>

            {showAllMyDelegationPopup && (
              <AllMyDelegationPopup setShow={setShowAllMyDelegationPopup} />
            )}
          </>
        )}

        {!!beenDelegatedList?.length && (
          <>
            <HStack space={8}>
              <GreyInfoPanel>
                Been delegated <Count>{beenDelegatedList.length}</Count>
              </GreyInfoPanel>

              <Tooltip content="Delegated detail">
                <div>
                  <ListButton
                    onClick={() => setShowAllBeenDelegatedPopup(true)}
                  >
                    <ListSVG />
                  </ListButton>
                </div>
              </Tooltip>
            </HStack>

            {showAllBeenDelegatedPopup && (
              <AllBeenDelegatedListPopup
                beenDelegatedList={beenDelegatedList}
                setShow={setShowAllBeenDelegatedPopup}
              />
            )}
          </>
        )}

        {!hideActionButtons && (
          <ButtonWrapper>
            <Button onClick={() => setShowDelegatePopup(true)}>
              <AddSVG />
              New Delegate
            </Button>
          </ButtonWrapper>
        )}
      </VStack>
    </Wrapper>
  );
}
