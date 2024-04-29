import MailLogin from "./mailLogin";

export default function LoginAccountLoginContent() {
  return (
    <div className="space-y-6">
      <h3 className="text20Bold text-textPrimary">
        <span>{"Connect with "}</span>
        <span className="text-theme500">Account</span>
      </h3>

      <MailLogin />
    </div>
  );
}
