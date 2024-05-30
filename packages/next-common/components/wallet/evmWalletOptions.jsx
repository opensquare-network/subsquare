import { useEVMWalletOptions } from "next-common/hooks/connect/useEVMWalletOptions";
import WalletOption from "./walletOption";
import { noop } from "lodash-es";

export default function EVMWalletOptions({
  selectedConnector,
  onSelect = noop,
}) {
  const evmOptions = useEVMWalletOptions();

  return evmOptions.map((option) => {
    let icon;
    if (option.logo) {
      icon = <option.logo className="w-6 h-6" />;
    } else if (option.connector.icon) {
      icon = <img src={option.connector.icon} className="w-6 h-6" />;
    }

    const installed = !!option.connector;

    return (
      <WalletOption
        key={option.extensionName}
        installed={installed}
        selected={selectedConnector?.id === option.connector?.id}
        onClick={() => {
          if (!installed) {
            return;
          }

          onSelect(option);
        }}
        logo={icon}
        title={option.title}
      />
    );
  });
}
