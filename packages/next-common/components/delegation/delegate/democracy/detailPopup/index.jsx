import AccountLinks from "next-common/components/links/accountLinks";
import Popup from "next-common/components/popup/wrapper/Popup";
import DemocracyDelegationCardSummary from "../summary";
import AddressUser from "next-common/components/user/addressUser";
import { DelegateAvatar } from "../../referenda/avatar";
import DemocracyDelegateeDetailPopupTabsContent from "./tabsContent";
// import DetailButtons from "../../common/detailButtons";

export default function DemocracyDelegateeDetailPopup({
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
          <DelegateAvatar address={address} />
          {/* <DetailButtons address={address} /> */}
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
        <AccountLinks address={address} showCouncilorLink={false} />
      </div>

      <hr />

      <DemocracyDelegationCardSummary delegate={delegate} />

      <DemocracyDelegateeDetailPopupTabsContent delegate={delegate} />
    </Popup>
  );
}
