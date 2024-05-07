import LoginEVMForm from "./form";

export default function LoginEVMContent() {
  return (
    <div className="space-y-6">
      <h3 className="text20Bold text-textPrimary">
        <span>{"Connect with "}</span>
        <span className="text-theme500">EVM Address</span>
      </h3>

      <LoginEVMForm />
    </div>
  );
}
