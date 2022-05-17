import styled from "styled-components";
import NextHead from "next-common/components/nextHead";
import BrowserIncompatible from "next-common/components/browserIncompatible";

const Wrapper = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  p{
    margin-top: 24px;
    font-weight: 700;
    font-size: 20px;
    line-height: 100%;
  }
  span{
    max-width: 343px;
    font-size: 14px;
    line-height: 140%;
    text-align: center;
    color: #506176;
   }
`;

export default function CustomErrPage() {
  return (
    <Wrapper>
      <NextHead title={`Browser not Supported`} desc={`Please use Google Chrome, Microsoft Edge or Safari 14.1+ to access for good web experience.`} />
      <BrowserIncompatible/>
    </Wrapper>
  );
}
