import flexBetweenCenter from "next-common/components/styled/flexBetweenCenter";
import styled from "styled-components";
import {
  useAllBeenDelegatedList,
  useAllDelegationList,
} from "next-common/utils/hooks/referenda/useDelegations";
import { Button } from "next-common/components/summary/styled";
import VStack from "next-common/components/styled/vStack";

const Wrapper = styled(flexBetweenCenter)`
  gap: 8px;
  flex-wrap: wrap;
`;

export default function AllDelegation({}) {
  const { delegationList } = useAllDelegationList();
  const { beenDelegatedList } = useAllBeenDelegatedList();

  return (
    <Wrapper>
      <VStack space={8}>
        <Button>New Delegate</Button>

        <div>My delegation {delegationList?.length}</div>
        <div>Been delegated {beenDelegatedList?.length}</div>
      </VStack>
    </Wrapper>
  );
}
