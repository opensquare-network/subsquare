import { PageTitleContainer } from "../styled/containers/titleContainer";
import MailLogin from "./mailLogin";

export default function LoginPopupAccountLoginContent({ onClose, setView }) {
  return (
    <div>
      <PageTitleContainer>Login</PageTitleContainer>

      <MailLogin onClose={onClose} setView={setView} />
    </div>
  );
}
