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

export default function AllDelegation({}) {
  const { delegationList } = useAllDelegationList();
  const { beenDelegatedList } = useAllBeenDelegatedList();

  return (
    <Wrapper>
      <VStack space={8}>
        <ButtonWrapper>
          <Button>
            <AddSVG />
            New Delegate
          </Button>
        </ButtonWrapper>

        {!!delegationList?.length && (
          <HStack space={8}>
            <div>My delegation {delegationList.length}</div>
          </HStack>
        )}

        {!!beenDelegatedList?.length && (
          <HStack space={8}>
            <div>Been delegated {beenDelegatedList.length}</div>
          </HStack>
        )}
      </VStack>
    </Wrapper>
  );
}
