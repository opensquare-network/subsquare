import styled from "styled-components";
import { StatisticTitleContainer } from "next-common/components/styled/containers/titleContainer";
import Flex from "next-common/components/styled/flex";
import { useOnchainData, usePostState } from "next-common/context/post";
import { useScreenSize } from "next-common/utils/hooks/useScreenSize";
import { useMemo } from "react";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import Anchor from "next-common/components/styled/anchor";
import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import AddressUser from "next-common/components/user/addressUser";
import {
  SideInfoItem,
  SideInfoItemName,
  SideInfoItemValue,
} from "next-common/components/detail/common/sidebar";
import useSubStorage from "next-common/hooks/common/useSubStorage";

const Info = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 16px;
`;

const WRAPPER_WIDTH = 300;

function MetaGuard({ children }) {
  const state = usePostState();
  const { parentBountyId, index: childBountyId } = useOnchainData();
  const { result } = useSubStorage("childBounties", "childBounties", [
    parentBountyId,
    childBountyId,
  ]);

  const shouldShow = useMemo(() => {
    if (result?.isSome) {
      const unwrapped = result.unwrap();
      if (unwrapped.status.isPendingPayout) {
        return true;
      }
    } else {
      return ["PendingPayout", "Claimed"].includes(state);
    }
  }, [state, result]);

  return shouldShow ? children : null;
}

function Meta() {
  const onChain = useOnchainData();
  const { decimals, symbol } = useChainSettings();
  const { lg, sm } = useScreenSize();
  const beneficiaryUserMaxWidth = useMemo(() => {
    if (sm) return WRAPPER_WIDTH / 2;
    else if (lg) return 124;
    else return null;
  }, [lg, sm]);

  return (
    <SecondaryCardDetail>
      <StatisticTitleContainer className="!px-0">
        <Flex>
          <span>Overview</span>
        </Flex>
      </StatisticTitleContainer>
      <Info>
        <SideInfoItem>
          <SideInfoItemName>Beneficiary</SideInfoItemName>
          <SideInfoItemValue>
            <AddressUser
              add={onChain.beneficiary}
              maxWidth={beneficiaryUserMaxWidth}
            />
          </SideInfoItemValue>
        </SideInfoItem>
        <SideInfoItem>
          <SideInfoItemName>Value</SideInfoItemName>
          <SideInfoItemValue>
            <ValueDisplay
              className={"font-medium"}
              value={toPrecision(onChain.meta?.value ?? 0, decimals)}
              symbol={symbol}
            />
          </SideInfoItemValue>
        </SideInfoItem>
        <SideInfoItem>
          <SideInfoItemName>Curator fee</SideInfoItemName>
          <SideInfoItemValue>
            <ValueDisplay
              value={toPrecision(onChain.meta?.fee ?? 0, decimals)}
              symbol={symbol}
            />
          </SideInfoItemValue>
        </SideInfoItem>
        <SideInfoItem>
          <SideInfoItemName>Parent bounty</SideInfoItemName>
          <SideInfoItemValue>
            <Anchor href={`/treasury/bounties/${onChain.parentBountyId}`}>
              {`#${onChain.parentBountyId}`}
            </Anchor>
          </SideInfoItemValue>
        </SideInfoItem>
      </Info>
    </SecondaryCardDetail>
  );
}

export default function ChildBountyMeta() {
  return (
    <MetaGuard>
      <Meta />
    </MetaGuard>
  );
}
