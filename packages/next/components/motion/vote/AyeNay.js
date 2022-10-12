import AyeIcon from "public/imgs/icons/aye.svg";
import NayIcon from "public/imgs/icons/nay.svg";
import styled from "styled-components";

const Wrapper = styled.span`
  white-space: nowrap;
  display: flex;
  align-items: center;
  > svg {
    margin-left: 8px;
  }
`;

export default function AyeNay({ isAye = true }) {
  const text = isAye ? "Aye" : "Nay";
  const icon = isAye ? <AyeIcon /> : <NayIcon />;

  return <Wrapper>
    {text} {icon}
  </Wrapper>
}
