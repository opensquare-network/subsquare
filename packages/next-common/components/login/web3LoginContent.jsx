import AddressLogin from "./addressLogin";

export default function LoginWeb3LoginContent({ setView }) {
  return (
    <div className="space-y-6">
      <div className="text20Bold text-textPrimary">
        <span>{"Connect with "}</span>
        <span className="text-theme500">Address</span>
      </div>

      <AddressLogin setView={setView} />
    </div>
  );
}
