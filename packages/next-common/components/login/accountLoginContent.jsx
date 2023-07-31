import { PageTitleContainer } from "../styled/containers/titleContainer";
import MailLogin from "./mailLogin";

export default function LoginAccountLoginContent({ setView }) {
  return (
    <div>
      <PageTitleContainer>Login</PageTitleContainer>

      <MailLogin setView={setView} />
    </div>
  );
}
