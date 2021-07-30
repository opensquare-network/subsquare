import styled from "styled-components";
import Link from "next/link";

const Wrapper = styled.div`
  display: inline-block;
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  > img {
    width: 14px;
    height: 14px;
    margin-right: 12px;
  }
`;

export default function Back() {
  return (
    <Link href="/">
      <Wrapper>
        <img src="/imgs/icons/arrow-left.svg" />
        <div>Back to Overveiw</div>
      </Wrapper>
    </Link>
  );
}
