import NextHead from "next-common/components/nextHead";
import BrowserIncompatible from "next-common/components/browserIncompatible";

export default function CustomErrPage() {
  return (
    <>
      <NextHead title={`Browser not Supported`} desc={`Please use Google Chrome, Microsoft Edge or Safari 14.1+ to access for good web experience.`} />
      <BrowserIncompatible/>
    </>
  );
}
