import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";
import PrimaryButton from "../buttons/primaryButton";
import { ContentWrapper, InfoMessage } from "./styled";

export default function RequireSignature() {
  const { ensureLogin } = useEnsureLogin();
  return (
    <ContentWrapper>
      <InfoMessage>
        Please complete your signature before continuing with notification
        Settings.
      </InfoMessage>
      <PrimaryButton onClick={ensureLogin}>
        Sign with connected wallet
      </PrimaryButton>
    </ContentWrapper>
  );
}
