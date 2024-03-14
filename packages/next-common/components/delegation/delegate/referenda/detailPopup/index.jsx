import AccountLinks from "next-common/components/links/accountLinks";
import Popup from "next-common/components/popup/wrapper/Popup";
import ReferendaDelegationCardSummary from "../summary";
import AddressUser from "next-common/components/user/addressUser";
import { DelegateAvatar } from "../avatar";
import ReferendaDelegateeDetailPopupTabsContent from "./tabsContent";

export default function ReferendaDelegateeDetailPopup({
  delegate,
  setDetailOpen,
}) {
  const { address, manifesto } = delegate;

  return (
    <Popup
      title="Delegatee Detail"
      className="w-[800px] max-w-full"
      onClose={() => {
        setDetailOpen(false);
      }}
    >
      <div>
        <div>
          <DelegateAvatar address={address} image={manifesto?.image} />
          {/* TODO: delegation edit, revoke */}
        </div>
        <div className="mt-3">
          <AddressUser
            showAvatar={false}
            add={address}
            className="[&_.identity]:!font-semibold"
          />
        </div>
      </div>

      {manifesto?.shortDescription && (
        <div className="text-textTertiary text14Medium">
          {manifesto.shortDescription}
        </div>
      )}

      <div>
        <AccountLinks address={address} />
      </div>

      <hr />

      <ReferendaDelegationCardSummary delegate={delegate} />

      <ReferendaDelegateeDetailPopupTabsContent delegate={delegate} />
    </Popup>
  );
}
