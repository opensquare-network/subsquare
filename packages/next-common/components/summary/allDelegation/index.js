import flexBetweenCenter from "next-common/components/styled/flexBetweenCenter";
import styled from "styled-components";
import { useAllMyBeenDelegatedList } from "next-common/utils/hooks/referenda/useAllBeenDelegatedList";
import VStackOrigin from "next-common/components/styled/vStack";
import Flex from "next-common/components/styled/flex";
import { useSelector } from "react-redux";
import { useChainSettings } from "next-common/context/chain";
import useFetchMyReferendaDelegations from "next-common/utils/hooks/referenda/useFetchMyReferendaDelegations";
import { myReferendaDelegationsSelector } from "next-common/store/reducers/myOnChainData/referenda/myReferendaDelegations";
import NewDelegateButton from "./newDelegateButton";
import AllMyDelegation from "./allMyDelegation";
import AllBeenDelegated from "./allBeenDelegated";

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

export default function AllDelegation() {
  useFetchMyReferendaDelegations();
  const delegations = useSelector(myReferendaDelegationsSelector);
  const { beenDelegatedList } = useAllMyBeenDelegatedList();
  const { hideActionButtons } = useChainSettings();

  return (
    <Wrapper>
      <VStack space={8}>
        {!!delegations?.length && <AllMyDelegation delegations={delegations} />}

        {!!beenDelegatedList?.length && (
          <AllBeenDelegated beenDelegatedList={beenDelegatedList} />
        )}

        {!hideActionButtons && (
          <ButtonWrapper className="gap-[8px]">
            <NewDelegateButton />
          </ButtonWrapper>
        )}
      </VStack>
    </Wrapper>
  );
}
