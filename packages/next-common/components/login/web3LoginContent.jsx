import AddressLogin from "./addressLogin";

export default function LoginWeb3LoginContent() {
  return (
    <div className="space-y-6">
      <h3 className="text20Bold text-textPrimary">
        <span>{"Connect with "}</span>
        <span className="text-theme500">Address</span>
      </h3>

      <AddressLogin />
    </div>
  );
}
