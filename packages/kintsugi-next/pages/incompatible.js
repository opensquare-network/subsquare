import styled from "styled-components";
import NextHead from "next-common/components/nextHead";
import Contacts from "next-common/components/layout/contacts";
import Hint from "public/imgs/oops.svg";

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
      <NextHead title={`Not Found`} desc={``} />
      <Hint/>
      <p>Browser not Supported</p>
      <span>
        Please use Google Chrome, Microsoft Edge or Safari 15+ to access for good web experience.
      </span>
      <p style={{fontSize:14}}>Contact Us</p>
      <Contacts/>
    </Wrapper>
  );
}
