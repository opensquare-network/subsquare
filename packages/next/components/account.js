import styled from "styled-components";
import Flex from "./styled/flex";
import Image from "next/image";
const Wrapper = styled(Flex)`
  display: flex;
  align-items: center;
  > img {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }
`;

export default function Account({ name }) {
  return (
    <Wrapper>
      <Image src="/imgs/icons/avatar.svg" alt="" />
      <div>{name}</div>
    </Wrapper>
  );
}
