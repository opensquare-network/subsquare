import styled from "styled-components";
import IdentityIcon from "./identityIcon";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 20px;

  svg {
    margin-right: 4px;
  }

  a {
    width: 20px;
    height: 20px;
    margin-left: 8px;
  }

  color: #111;
  font-weight: 500;
`;


const Display = styled.span`
  margin-right: 8px;
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
