import { useConnect } from "wagmi";
import { useDispatch } from "react-redux";
import { setConnectPopupView } from "next-common/store/reducers/connectPopupSlice";
import PrimaryButton from "next-common/lib/button/primary";
import WalletOption from "../wallet/walletOption";

export default function LoginWeb3EVMLoginContent() {
  const { connectors, connect } = useConnect();
  connect;
  connectors;

  return (
    <div className="space-y-6">
      <h3 className="text20Bold text-textPrimary">
        <span>{"Connect with "}</span>
        <span className="text-theme500">EVM Address</span>
      </h3>

      <EVMLogin />
    </div>
  );
}

function EVMLogin() {
  const dispatch = useDispatch();
  const { connectors } = useConnect();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-2">
        {connectors.map((connector) => (
          <WalletOption key={connector.id} installed>
            <div className="flex items-center">
              <img src={connector.icon} className="w-6 h-6" />
              {connector.name}
            </div>
          </WalletOption>
        ))}
      </div>

      <div>
        <PrimaryButton className="w-full" onClick={() => {}}>
          Next
        </PrimaryButton>
      </div>

      <div className="text14Medium text-center text-textSecondary">
        Login with{" "}
        <span
          className="text-theme500"
          role="button"
          onClick={() => {
            dispatch(setConnectPopupView("account"));
          }}
        >
          account
        </span>
      </div>
    </div>
  );
}
