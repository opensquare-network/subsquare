import { PageTitleContainer } from "../styled/containers/titleContainer";
import MailLogin from "./mailLogin";

export default function LoginAccountLoginContent({ setView }) {
  return (
    <div className="space-y-6">
      <PageTitleContainer>Login to SubSquare</PageTitleContainer>

      <MailLogin setView={setView} />
    </div>
  );
}
