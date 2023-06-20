import React from "react";
import styled from "styled-components";

const Common = styled.div`
  display: inline-flex !important;
  height: unset;
  align-items: center;

  padding: 2px 8px;
  border-radius: 10px;

  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  white-space: nowrap;
`;

const Treasury = styled(Common)`
  background: var(--yellow100);
  color: var(--yellow500);
`;

const Democracy = styled(Common)`
  background: ${(props) => props.theme.secondaryPink100};
  color: ${(props) => props.theme.secondaryPink500};
`;

const OpenGov = styled(Common)`
  background: ${(props) => props.theme.secondaryBlue100};
  color: ${(props) => props.theme.secondaryBlue500};
`;

const Collectives = styled(Common)`
  background: ${(props) => props.theme.secondaryGreen100};
  color: ${(props) => props.theme.secondaryGreen500};
`;

const Staking = styled(Common)`
  background: ${(props) => props.theme.secondaryGray100};
  color: ${(props) => props.theme.secondaryGray500};
`;

const Scheduler = styled(Common)`
  background: ${(props) => props.theme.secondaryGray100};
  color: ${(props) => props.theme.secondaryGray500};
`;

const Society = styled(Common)`
  background: ${(props) => props.theme.secondaryGray100};
  color: ${(props) => props.theme.secondaryGray500};
`;

const Parachain = styled(Common)`
  background: ${(props) => props.theme.secondaryGray100};
  color: ${(props) => props.theme.secondaryGray500};
`;

const UserEvent = styled(Common)`
  background: ${(props) => props.theme.secondaryGray100};
  color: ${(props) => props.theme.secondaryGray500};
`;

export function TreasuryTag() {
  return <Treasury>Treasury</Treasury>;
}

export function DemocracyTag() {
  return <Democracy>Democracy</Democracy>;
}

export function OpenGovTag() {
  return <OpenGov>OpenGov</OpenGov>;
}

export function CollectivesTag() {
  return <Collectives>Collectives</Collectives>;
}

export function StakingTag() {
  return <Staking>Staking</Staking>;
}

export function SchedulerTag() {
  return <Scheduler>Scheduler</Scheduler>;
}

export function SocietyTag() {
  return <Society>Society</Society>;
}

export function ParachainTag() {
  return <Parachain>Parachain</Parachain>;
}

export function UserEventTag() {
  return <UserEvent>User Event</UserEvent>;
}
