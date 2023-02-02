import flexBetweenCenter from "next-common/components/styled/flexBetweenCenter";
import styled from "styled-components";
import {
  useAllBeenDelegatedList,
  useAllDelegationList,
} from "next-common/utils/hooks/referenda/useDelegations";
import { Button } from "next-common/components/summary/styled";
import VStackOrigin from "next-common/components/styled/vStack";
import AddSVG from "next-common/assets/imgs/icons/add.svg";
import HStack from "next-common/components/styled/hStack";
import Flex from "next-common/components/styled/flex";
import GreyInfoPanel from "next-common/components/summary/styled/greyInfoPanel";
import ListSVG from "next-common/assets/imgs/icons/list.svg";
import Tooltip from "next-common/components/tooltip";
import DelegatePopup from "components/gov2/delegatePopup";
import { useState } from "react";

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

export default function AllDelegation({}) {
  const { delegationList } = useAllDelegationList();
  const { beenDelegatedList } = useAllBeenDelegatedList();

  const [showDelegatePopup, setShowDelegatePopup] = useState(false);

  return (
    <Wrapper>
      <VStack space={8}>
        <ButtonWrapper>
          <Button onClick={() => setShowDelegatePopup(true)}>
            <AddSVG />
            New Delegate
          </Button>
        </ButtonWrapper>

        {showDelegatePopup && (
          <DelegatePopup
            trackId={0}
            onClose={() => setShowDelegatePopup(false)}
          />
        )}

        {!!delegationList?.length && (
          <HStack space={8}>
            <GreyInfoPanel>
              My delegation <Count>{delegationList.length}</Count>
            </GreyInfoPanel>

            <Tooltip content="My delegation detail">
              <div>
                <ListButton>
                  <ListSVG />
                </ListButton>
              </div>
            </Tooltip>
          </HStack>
        )}

        {!!beenDelegatedList?.length && (
          <HStack space={8}>
            <GreyInfoPanel>
              Been delegated <Count>{beenDelegatedList.length}</Count>
            </GreyInfoPanel>

            <Tooltip content="Delegated detail">
              <div>
                <ListButton>
                  <ListSVG />
                </ListButton>
              </div>
            </Tooltip>
          </HStack>
        )}
      </VStack>
    </Wrapper>
  );
}
