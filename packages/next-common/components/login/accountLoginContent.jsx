import MailLogin from "./mailLogin";

export default function LoginAccountLoginContent({ setView }) {
  return (
    <div className="space-y-6">
      <div className="text20Bold text-textPrimary">
        <span>{"Connect with "}</span>
        <span className="text-theme500">Account</span>
      </div>

      <MailLogin setView={setView} />
    </div>
  );
}
