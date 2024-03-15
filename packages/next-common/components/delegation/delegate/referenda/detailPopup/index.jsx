import AccountLinks from "next-common/components/links/accountLinks";
import Popup from "next-common/components/popup/wrapper/Popup";
import ReferendaDelegationCardSummary from "../summary";
import AddressUser from "next-common/components/user/addressUser";
import { DelegateAvatar } from "../avatar";
import ReferendaDelegateeDetailPopupTabsContent from "./tabsContent";
import SecondaryButton from "next-common/lib/button/secondary";
import { SystemEdit2, SystemSubtract } from "@osn/icons/subsquare";

function EditButton() {
  return (
    <SecondaryButton size="small">
      <div className="flex gap-[6px]">
        <SystemEdit2 className="w-4 h-4" />
        <span>Edit</span>
      </div>
    </SecondaryButton>
  );
}

function RevokeButton() {
  return (
    <SecondaryButton size="small">
      <div className="flex gap-[6px]">
        <SystemSubtract className="w-4 h-4" />
        <span>Revoke</span>
      </div>
    </SecondaryButton>
  );
}

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
        <div className="flex justify-between">
          <DelegateAvatar address={address} image={manifesto?.image} />
          <div className="flex gap-[8px]">
            <EditButton />
            <RevokeButton />
          </div>
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
