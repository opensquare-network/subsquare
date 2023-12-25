import PrimaryButton from "../buttons/primaryButton";
import { ContentWrapper, InfoMessage } from "./styled";

export default function RequireSignature() {
  return (
    <ContentWrapper>
      <InfoMessage>
        Please complete your signature before continuing with notification
        Settings.
      </InfoMessage>
      <PrimaryButton>Sign with connected wallet</PrimaryButton>
    </ContentWrapper>
  );
}
