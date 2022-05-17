import Contacts from "next-common/components/layout/contacts";
import Hint from "../assets/imgs/oops.svg";

export default function BrowserIncompatible() {
  return (
    <>
      <Hint/>
      <p>Browser not Supported</p>
      <span>
        Please use Google Chrome, Microsoft Edge or Safari 14.1+ to access for good web experience.
      </span>
      <p style={{fontSize:14}}>Contact Us</p>
      <Contacts/>
    </>
  );
}
