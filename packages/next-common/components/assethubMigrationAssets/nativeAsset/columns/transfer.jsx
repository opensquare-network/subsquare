import { SystemTransfer } from "@osn/icons/subsquare";
import ListButton from "next-common/components/styled/listButton";
import Tooltip from "next-common/components/tooltip";
import { useAccountTransferPopup } from "next-common/components/overview/accountInfo/hook/useAccountTransferPopup";

function TransferButton() {
  const { showPopup, component: transferPopup } = useAccountTransferPopup();

  return (
    <>
      <Tooltip content="Transfer">
        <ListButton
          onClick={() => {
            showPopup();
          }}
        >
          <SystemTransfer width={16} height={16} />
        </ListButton>
      </Tooltip>
      {transferPopup}
    </>
  );
}

export const colTransfer = {
  name: "",
  style: { textAlign: "right", width: "80px", minWidth: "80px" },
  render: () => {
    return <TransferButton />;
  },
};
