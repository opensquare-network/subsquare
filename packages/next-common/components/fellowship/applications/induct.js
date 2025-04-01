import { useCallback } from "react";
import PrimaryButton from "next-common/lib/button/primary";
import { useCoreFellowshipPallet } from "next-common/context/collectives/collectives";
import Tooltip from "next-common/components/tooltip";
import { useFellowshipCanInductMember } from "next-common/hooks/fellowship/useFellowshipCanInductMember";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import { useContextApi } from "next-common/context/api";
import useTxSubmission from "next-common/components/common/tx/useTxSubmission";
import { useDispatch } from "react-redux";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import { useConnectedAccount } from "next-common/context/connectedAccount";
import nextApi from "next-common/services/nextApi";
import { usePost } from "next-common/context/post";
import { useRouter } from "next/router";

function InductButton({ address }) {
  const router = useRouter();
  const post = usePost();
  const dispatch = useDispatch();
  const api = useContextApi();
  const pallet = useCoreFellowshipPallet();
  const canInductMember = useFellowshipCanInductMember();

  const getTxFunc = useCallback(() => {
    if (api && address) {
      return api.tx[pallet].induct(address);
    }
  }, [api, address, pallet]);

  const onInBlock = useCallback(() => {
    dispatch(newSuccessToast("Inducted"));
    nextApi
      .patch(`fellowship/applications/${post._id}/refresh-status`)
      .then(({ error }) => {
        if (error) {
          console.error(error);
        }
      });
    router.replace(router.asPath);
  }, [dispatch, router, post?._id]);

  const { doSubmit } = useTxSubmission({ getTxFunc, onInBlock });

  return (
    <>
      <Tooltip
        content={!canInductMember && "Only available to members with rank >= 3"}
      >
        <PrimaryButton
          size="small"
          disabled={!canInductMember}
          onClick={doSubmit}
        >
          Induct
        </PrimaryButton>
      </Tooltip>
    </>
  );
}

function NotConnected() {
  return (
    <Tooltip content={"Connect with address first"}>
      <PrimaryButton size="small" disabled={true}>
        Induct
      </PrimaryButton>
    </Tooltip>
  );
}

export default function Induct({ address }) {
  const connectedAccount = useConnectedAccount();
  if (!connectedAccount) {
    return <NotConnected />;
  }

  return (
    <SignerPopupWrapper>
      <InductButton address={address} />
    </SignerPopupWrapper>
  );
}
