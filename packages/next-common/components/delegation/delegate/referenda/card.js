import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import Avatar from "next-common/components/avatar";
import AddressUser from "next-common/components/user/addressUser";
import React from "react";
import Divider from "next-common/components/styled/layout/divider";
import InfoLine from "next-common/components/delegation/delegate/common/info/line";
import InfoWrapper from "next-common/components/delegation/delegate/common/info/wrapper";
import InfoTitle from "next-common/components/delegation/delegate/common/info/title";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { cn, toPercentage, toPrecision } from "next-common/utils";
import styled from "styled-components";
import Flex from "next-common/components/styled/flex";
import tw from "tailwind-styled-components";
import Tooltip from "next-common/components/tooltip";
import AccountLinks from "next-common/components/links/accountLinks";

const TitleExtraValue = styled(Flex)`
  color: var(--textPrimary);
`;
const TitleExtra = tw.div`
  text14Bold
  flex items-start
  text-textTertiary
`;

function DelegateAvatar({ address, image }) {
  return (
    <div className="flex flex-col">
      <div className="relative w-10 h-10">
        {image ? (
          <img
            className="rounded-full"
            src={image}
            width={40}
            height={40}
            alt="avatar image"
          />
        ) : (
          <Avatar address={address} size={40} />
        )}
      </div>
    </div>
  );
}

export default function ReferendaDelegateCard({ delegate = {} }) {
  const {
    address,
    delegatorsCount,
    trackAverageVotes,
    participationRate,
    manifesto,
  } = delegate;
  const { decimals, symbol } = useChainSettings();

  return (
    <SecondaryCard className="flex flex-col">
      <div className="flex justify-between">
        <DelegateAvatar address={address} image={delegate.manifesto?.image} />
      </div>
      <div className="flex justify-between mt-3">
        <AddressUser
          add={address}
          showAvatar={false}
          fontSize={14}
          className="[&_.identity]:!font-semibold"
        />
      </div>

      <div className="mt-3 space-y-3 h-full flex flex-col">
        <Tooltip
          className="block h-full"
          delayDuration={700}
          content={
            manifesto?.longDescription && (
              <div className="max-w-xs">{manifesto?.shortDescription}</div>
            )
          }
        >
          <div className={cn("text-textTertiary text14Medium", "line-clamp-2")}>
            {manifesto?.shortDescription || "-"}
          </div>
        </Tooltip>

        <AccountLinks address={address} />
      </div>

      <Divider className="mt-4" />

      <InfoLine>
        <InfoWrapper>
          <Tooltip content="Average received delegations each track">
            <InfoTitle>Average Delegated</InfoTitle>
          </Tooltip>
          <TitleExtra>
            <TitleExtraValue>
              <ValueDisplay
                value={toPrecision(trackAverageVotes, decimals)}
                symbol={symbol}
              />
            </TitleExtraValue>
          </TitleExtra>
        </InfoWrapper>
        <InfoWrapper>
          <InfoTitle>Delegators</InfoTitle>
          <p className="text14Bold">{delegatorsCount}</p>
        </InfoWrapper>
      </InfoLine>

      <InfoLine>
        <InfoWrapper>
          <InfoTitle>Participation Rate</InfoTitle>
          <p className="text14Bold">{toPercentage(participationRate, 1)}%</p>
        </InfoWrapper>
        <InfoWrapper />
      </InfoLine>
    </SecondaryCard>
  );
}
