import styled from "styled-components";
import IdentityIcon from "./identityIcon";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  svg {
    margin-right: 4px;
    margin-left: 4px;
  }
`;


const Display = styled.span`
  font-size: 12px;
  font-weight: 600;
`;

export default function Identity({ identity }) {
  if (!identity) {
    return null;
  }

  const displayName = identity?.info?.displayParent
    ? `${identity?.info?.displayParent}/${identity?.info?.display}`
    : identity?.info?.display;

  return (
    <Wrapper>
      <IdentityIcon identity={identity} />
      <Display>{displayName}</Display>
    </Wrapper>
  );
}
