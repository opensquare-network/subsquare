import { useEnsureConnectedWalletLoggedIn } from "next-common/utils/login";
import PrimaryButton from "../buttons/primaryButton";
import { ContentWrapper, InfoMessage } from "./styled";

export default function RequireSignature() {
  const { login } = useEnsureConnectedWalletLoggedIn();
  return (
    <ContentWrapper>
      <InfoMessage>
        Please complete your signature before continuing with notification
        Settings.
      </InfoMessage>
      <PrimaryButton onClick={login}>Sign with connected wallet</PrimaryButton>
    </ContentWrapper>
  );
}
