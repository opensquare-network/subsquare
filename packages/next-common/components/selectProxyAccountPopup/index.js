import { GeneralProxiesProvider } from "next-common/context/proxy";
import Popup from "../popup/wrapper/Popup";
import { ProxiedAccounts } from "../switchSignerPopup";
import { noop } from "lodash-es";

export default function SelectProxyAccountPopup({ onClose, onSelect = noop }) {
  return (
    <Popup title="Select Address" className="w-[640px]" onClose={onClose}>
      <GeneralProxiesProvider>
        <div className="flex flex-col gap-[24px]">
          <ProxiedAccounts onSelect={onSelect} />
        </div>
      </GeneralProxiesProvider>
    </Popup>
  );
}
