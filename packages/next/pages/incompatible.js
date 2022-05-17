import styled from "styled-components";
import NextHead from "next-common/components/nextHead";
import Contacts from "next-common/components/layout/contacts";

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
      <svg width="215" height="60" viewBox="0 0 215 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.05599 51.4286H0.5V8.57143H9.05599V51.4286ZM43.2799 51.4286H34.724V8.57143H43.2799V51.4286ZM34.724 8.57143H9.05599V0H34.724V8.57143ZM34.724 60H9.05599V51.4286H34.724V60Z" fill="#D7DEE8"/>
        <path d="M60.417 51.4286H51.861V8.57143H60.417V51.4286ZM94.6409 51.4286H86.085V8.57143H94.6409V51.4286ZM86.085 8.57143H60.417V0H86.085V8.57143ZM86.085 60H60.417V51.4286H86.085V60Z" fill="#D7DEE8"/>
        <path d="M146.002 25.7143H137.446V8.57143H146.002V25.7143ZM137.446 0V8.57143H111.778V25.7143H137.446V34.2857H111.778V60H103.222V0H137.446Z" fill="#D7DEE8"/>
        <path d="M163.139 51.4286H154.583V42.8571H163.139V51.4286ZM188.807 60H163.139V51.4286H188.807V60ZM197.363 51.4286H188.807V34.2857H197.363V51.4286ZM188.807 8.57143H163.139V0H188.807V8.57143ZM197.363 17.1429H188.807V8.57143H197.363V17.1429ZM163.139 25.7143H154.583V8.57143H163.139V25.7143ZM188.807 34.2857H163.139V25.7143H188.807V34.2857Z" fill="#D7DEE8"/>
        <path d="M214.5 60H205.944V51.4286H214.5V60ZM214.5 42.8571H205.944V0H214.5V42.8571Z" fill="#D7DEE8"/>
      </svg>
      <p>Browser not Supported</p>
      <span>
        Please use Google Chrome, Microsoft Edge or Safari 15+ to access for good web experience.
      </span>
      <p style={{fontSize:14}}>Contact Us</p>
      <Contacts/>
    </Wrapper>
  );
}
