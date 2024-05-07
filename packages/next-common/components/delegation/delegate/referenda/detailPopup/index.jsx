import AccountLinks from "next-common/components/links/accountLinks";
import Popup from "next-common/components/popup/wrapper/Popup";
import ReferendaDelegationCardSummary from "../summary";
import AddressUser from "next-common/components/user/addressUser";
import { DelegateAvatar } from "../avatar";
import ReferendaDelegateeDetailPopupTabsContent from "./tabsContent";
import DetailButtons from "../../common/detailButtons";

export default function ReferendaDelegateeDetailPopup({
  delegate,
  setDetailOpen,
}) {
  const { address, manifesto, shortBio } = delegate;
  const shortDescription = shortBio || manifesto?.shortDescription;

  return (
    <Popup
      title="Delegate Detail"
      className="w-[800px] max-w-full"
      onClose={() => {
        setDetailOpen(false);
      }}
    >
      <div>
        <div className="flex justify-between">
          <DelegateAvatar address={address} />
          <DetailButtons address={address} />
        </div>
        <div className="mt-3">
          <AddressUser
            showAvatar={false}
            add={address}
            className="[&_.identity]:!font-semibold"
          />
        </div>
      </div>

      {shortDescription && (
        <div className="text-textTertiary text14Medium">{shortDescription}</div>
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
