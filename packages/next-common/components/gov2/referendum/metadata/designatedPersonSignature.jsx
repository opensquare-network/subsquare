import { isSameAddress } from "next-common/utils";
import Tooltip from "next-common/components/tooltip";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import {
  usePopupParams,
  useSignerAccount,
} from "next-common/components/popupWithSigner/context";

export default function DesignatedPersonSignature({ getTxFunc }) {
  const { deposit } = usePopupParams();
  const signerAccount = useSignerAccount();

  const isDesignatedPerson = isSameAddress(
    signerAccount?.realAddress,
    deposit?.who,
  );

  return (
    <div className="flex justify-end">
      <Tooltip
        content={
          !isDesignatedPerson ? "Only the designated person can refund" : null
        }
      >
        <TxSubmissionButton
          getTxFunc={getTxFunc}
          disabled={!isDesignatedPerson}
        />
      </Tooltip>
    </div>
  );
}
