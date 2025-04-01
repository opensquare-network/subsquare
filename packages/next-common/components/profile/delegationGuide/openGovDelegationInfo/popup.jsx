import Popup from "next-common/components/popup/wrapper/Popup";
import { CommonDelegationInfoPanel } from "../delegationInfo";
import DelegationList from "next-common/components/profile/delegation/common/delegationList";
import { useColumnsDef } from "next-common/components/profile/delegation/delegatedVotes/openGovDelegationList";

export default function MyOpenGovDelegationInfoPopup({ setDetailOpen, data }) {
  const columnsDef = useColumnsDef();

  return (
    <Popup
      title="My Delegation"
      className="w-[960px] max-w-full"
      onClose={() => {
        setDetailOpen(false);
      }}
    >
      <CommonDelegationInfoPanel showDivider={false}>
        <span className="text14Medium p-1">
          You can manage the delegation on the &nbsp;
          <a
            className="text-theme500"
            href={"/account/delegations"}
            target="_blank"
            rel="noreferrer"
          >
            account page
          </a>
          .
        </span>
      </CommonDelegationInfoPanel>
      <div className="max-h-[400px] scrollbar-pretty overflow-y-scroll space-y-2">
        <DelegationList
          isLoading={!data}
          delegations={data}
          columnsDef={columnsDef}
        />
      </div>
    </Popup>
  );
}
