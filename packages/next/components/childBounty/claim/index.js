import styled from "styled-components";
import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getNode, isSameAddress, toPrecision } from "next-common/utils";
import Loading from "next-common/components/loading";
import { GhostCard } from "next-common/components/styled/containers/ghostCard";
import Flex from "next-common/components/styled/flex";
import { StatisticTitleContainer } from "next-common/components/styled/containers/titleContainer";
import Anchor from "next-common/components/styled/anchor";
import User from "next-common/components/user";
import SecondaryButton from "next-common/components/buttons/secondaryButton";
import useApi from "next-common/utils/hooks/useSelectedEnpointApi";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { shadow_100 } from "next-common/styles/componentCss";
import ValueDisplay from "next-common/components/displayValue";
import { useUser } from "next-common/context/user";

const Popup = dynamic(() => import("./popup"), {
  ssr: false,
});

const Wrapper = styled.div`
  position: absolute;
  right: 0;
  top: 32px;
  width: 300px;
  margin-top: 0 !important;
  > :not(:first-child) {
    margin-top: 16px;
  }
  @media screen and (max-width: 1024px) {
    position: static;
    width: auto;
    margin-top: 16px !important;
  }
`;

const MyGhostCard = styled(GhostCard)`
  background: ${(props) => props.theme.neutral};
  border: 1px solid ${(props) => props.theme.grey200Border};
  ${shadow_100};
  border-radius: 6px;
  color: ${(props) => props.theme.textPrimary};
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 16px;
`;

const InfoItem = styled.div`
  display: flex;
  padding: 12px 0;
  :not(:last-child) {
    border-bottom: 1px solid ${(props) => props.theme.grey200Border};
  }
  font-size: 14px;
  line-height: 20px;
`;

const InfoItemName = styled.div`
  font-weight: 500;
`;

const InfoItemValue = styled.div`
  display: flex;
  justify-content: right;
  flex-grow: 1;
  font-weight: 400;

  > a {
    color: ${(props) => props.theme.secondarySapphire500};
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ClaimInfoText = styled.div`
  margin-top: 16px;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: ${(props) => props.theme.textTertiary};
  > span {
    color: ${(props) => props.theme.primaryPurple500};
    cursor: pointer;
  }
`;

export default function Claim({ chain, childBounty, onInBlock, onFinalized }) {
  const user = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isClaimed, setIsClaimed] = useState(
    childBounty.state?.state === "Claimed"
  );
  const isMounted = useIsMounted();

  const api = useApi(chain);

  const updateChildBountyStatus = useCallback(() => {
    setIsLoading(true);
    api.query.childBounties
      .childBounties(childBounty?.parentBountyId, childBounty?.index)
      .then((meta) => {
        const json = meta.toJSON();
        if (isMounted.current) {
          const isPendingPayout = !!json?.status?.pendingPayout;
          setIsClaimed(!isPendingPayout);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [api, childBounty, isMounted]);

  useEffect(() => {
    if (!childBounty || !api) {
      return;
    }

    if (childBounty.state?.state !== "PendingPayout") {
      return;
    }

    // Double check if child bounty onchain status is still in pending payout status
    updateChildBountyStatus();
  }, [api, childBounty, updateChildBountyStatus]);

  const onClaimInBlock = useCallback(() => {
    updateChildBountyStatus();
    onInBlock();
  }, [updateChildBountyStatus, onInBlock]);

  if (!["PendingPayout", "Claimed"].includes(childBounty.state?.state)) {
    return null;
  }

  const node = getNode(chain);
  if (!node) {
    return null;
  }

  const decimals = node.decimals;
  const symbol = node.symbol;

  const isBeneficiary = isSameAddress(
    user?.address,
    childBounty?.beneficiary
  );

  const hasBeenClaimedText = (
    <ClaimInfoText>This child bounty has been claimed.</ClaimInfoText>
  );

  const stillClaimText = (
    <ClaimInfoText>
      Only beneficiary can claim, no account found from the bounty.{" "}
      <span onClick={() => setShowPopup(true)}>Still claim</span>
    </ClaimInfoText>
  );

  const actionBtn = (
    <SecondaryButton isFill onClick={() => setShowPopup(true)}>
      Claim
    </SecondaryButton>
  );

  let actionContent = null;
  if (!isLoading) {
    if (isClaimed) {
      actionContent = hasBeenClaimedText;
    } else if (isBeneficiary) {
      actionContent = actionBtn;
    } else {
      actionContent = stillClaimText;
    }
  }

  return (
    <>
      <Wrapper>
        <MyGhostCard>
          <StatisticTitleContainer>
            <Flex>
              <span>Overview</span>
            </Flex>
            <div>{isLoading && <Loading size={16} />}</div>
          </StatisticTitleContainer>
          <Info>
            <InfoItem>
              <InfoItemName>Beneficiary</InfoItemName>
              <InfoItemValue>
                <User
                  chain={chain}
                  add={childBounty.beneficiary}
                  fontSize={14}
                />
              </InfoItemValue>
            </InfoItem>
            <InfoItem>
              <InfoItemName>Value</InfoItemName>
              <InfoItemValue>
                <ValueDisplay
                  value={toPrecision(childBounty.meta.value ?? 0, decimals)}
                  symbol={symbol}
                />
              </InfoItemValue>
            </InfoItem>
            <InfoItem>
              <InfoItemName>Curator fee</InfoItemName>
              <InfoItemValue>
                <ValueDisplay
                  value={toPrecision(childBounty.meta.fee ?? 0, decimals)}
                  symbol={symbol}
                />
              </InfoItemValue>
            </InfoItem>
            <InfoItem>
              <InfoItemName>Parent bounty</InfoItemName>
              <InfoItemValue>
                <Anchor href={`/treasury/bounty/${childBounty.parentBountyId}`}>
                  {`#${childBounty.parentBountyId}`}
                </Anchor>
              </InfoItemValue>
            </InfoItem>
          </Info>
        </MyGhostCard>
        {actionContent}
      </Wrapper>
      {showPopup && (
        <Popup
          chain={chain}
          childBounty={childBounty}
          onClose={() => setShowPopup(false)}
          onInBlock={onClaimInBlock}
          onFinalized={onFinalized}
          onSubmitted={() => setIsLoading(true)}
        />
      )}
    </>
  );
}
