import flexBetweenCenter from "next-common/components/styled/flexBetweenCenter";
import styled from "styled-components";
import { useAllMyDelegationList } from "next-common/utils/hooks/referenda/useAllMyDelegationList";
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
import { useCallback, useState } from "react";
import AllMyDelegationPopup from "next-common/components/summary/democracyAllMyDelegationPopup";
import AllBeenDelegatedListPopup from "next-common/components/summary/democracyAllBeenDelegatedPopup";
import { clearVotingForEntries } from "next-common/utils/gov2/gov2ReferendumVote";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import { useDispatch } from "react-redux";

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
  color: ${(p) => p.theme.textSecondary};
`;

const ListButton = styled(Button)`
  padding: 7px;
`;

export default function AllDelegation() {
  const dispatch = useDispatch();
  const { myDelegationList, refresh } = useAllMyDelegationList();
  const { beenDelegatedList } = useAllBeenDelegatedList();

  const [showDelegatePopup, setShowDelegatePopup] = useState(false);
  const [showAllMyDelegationPopup, setShowAllMyDelegationPopup] =
    useState(false);
  const [showAllBeenDelegatedPopup, setShowAllBeenDelegatedPopup] =
    useState(false);

  const onDelegateInBlock = useCallback(() => {
    clearVotingForEntries();
    refresh();
    dispatch(newSuccessToast("Delegate success"));
  }, [dispatch, refresh]);

  return (
    <Wrapper>
      <VStack space={8}>
        {showDelegatePopup && (
          <DelegatePopup
            trackId={0}
            showTrackSelect={true}
            onInBlock={onDelegateInBlock}
            onClose={() => setShowDelegatePopup(false)}
          />
        )}

        {!!myDelegationList?.length && (
          <>
            <HStack space={8}>
              <GreyInfoPanel>
                My delegation <Count>{myDelegationList.length}</Count>
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
              <AllMyDelegationPopup
                myDelegationList={myDelegationList}
                setShow={setShowAllMyDelegationPopup}
              />
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

        <ButtonWrapper>
          <Button onClick={() => setShowDelegatePopup(true)}>
            <AddSVG />
            New Delegate
          </Button>
        </ButtonWrapper>
      </VStack>
    </Wrapper>
  );
}
