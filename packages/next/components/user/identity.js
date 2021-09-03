import styled, { css } from "styled-components";
import IdentityIcon from "./identityIcon";

const Wrapper = styled.div`
  display: flex;
  align-items: center;

  svg {
    margin-right: 4px;
  }
`;


const Display = styled.span`
  font-size: ${(props) => props.fontSize}px;
  font-weight: 500;
  word-break: break-all;
`;

export default function Identity({identity, fontSize = 14}) {
  if (!identity) {
    return null;
  }

  const displayName = identity?.info?.displayParent
    ? `${identity?.info?.displayParent}/${identity?.info?.display}`
    : identity?.info?.display;

  return (
    <Wrapper>
      <IdentityIcon identity={identity}/>
      <Display fontSize={fontSize}>{displayName}</Display>
    </Wrapper>
  );
}
