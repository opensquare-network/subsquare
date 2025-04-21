import tw from "tailwind-styled-components";
import RightWrapper from "next-common/components/rightWraper";
import PrimaryButton from "next-common/lib/button/primary";
// import SecondaryButton from "next-common/lib/button/secondary";
import { Account } from "next-common/components/overview/accountInfo/accountInfoPanel";
import { cn } from "next-common/utils";
import Loading from "next-common/components/loading";
import { SystemEdit2 } from "@osn/icons/subsquare";
import Divider from "next-common/components/styled/layout/divider";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import { useState, useCallback } from "react";
import useMyIdentityType from "next-common/hooks/people/useMyIdentityType";
import { AddressUser } from "next-common/components/user";
import { useContextApi } from "next-common/context/api";
import { useDispatch } from "react-redux";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import useTxSubmission from "next-common/components/common/tx/useTxSubmission";
import RemoveButton from "next-common/components/removeButton";
import Tooltip from "next-common/components/tooltip";

const SetIdentityPopup = dynamicPopup(
  () => import("next-common/components/setIdentityPopup"),
  {
    ssr: false,
  },
);

// const RequestJudgementPopup = dynamicPopup(
//   () => import("next-common/components/requestJudgementPopup"),
//   {
//     ssr: false,
//   },
// );

export default function DirectIdentityImpl({
  isEmpty,
  identityInfo,
  isLoading,
}) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loading size="24" />
      </div>
    );
  }

  if (!isEmpty) {
    return (
      <SignerPopupWrapper>
        <DirectIdentity subMyIdentityInfo={identityInfo} />
      </SignerPopupWrapper>
    );
  }
  return <DirectIdentityEmpty />;
}

export function DirectIdentityEmpty() {
  const [showSetIdentityPopup, setShowSetIdentityPopup] = useState(false);
  return (
    <div className="space-y-4">
      <GreyPanel className="px-4 py-2.5 text14Medium text-textSecondary">
        No identity is set for the connected account.
      </GreyPanel>
      <RightWrapper>
        <PrimaryButton
          className="w-auto"
          onClick={() => setShowSetIdentityPopup(true)}
        >
          Set Identity
        </PrimaryButton>
      </RightWrapper>

      {showSetIdentityPopup && (
        <SetIdentityPopup onClose={() => setShowSetIdentityPopup(false)} />
      )}
    </div>
  );
}

export function DirectIdentity({ subMyIdentityInfo }) {
  const [showSetIdentityPopup, setShowSetIdentityPopup] = useState(false);
  // const [showRequestJudgementPopup, setShowRequestJudgementPopup] =
  //   useState(false);

  const { type, parent } = useMyIdentityType();
  const api = useContextApi();
  const dispatch = useDispatch();
  const address = useRealAddress();

  const getTxFunc = useCallback(() => {
    if (!api || !api?.tx?.identity || !address) {
      return;
    }

    return api.tx.identity.clearIdentity();
  }, [api, address]);

  const onInBlock = useCallback(() => {
    dispatch(newSuccessToast("Clear identity successfully"));
  }, [dispatch]);

  const { doSubmit, isSubmitting } = useTxSubmission({
    getTxFunc,
    onInBlock,
  });

  const isSubIdentity = type === "sub";

  return (
    <>
      {isSubIdentity && (
        <GreyPanel className="px-4 py-2.5 text14Medium text-textSecondary mb-4">
          Currently displayed as the sub identity of{" "}
          <AddressUser className="ml-1.5" add={parent} showAvatar={false} />.
        </GreyPanel>
      )}
      <div className="flex justify-between gap-2">
        <Account />
        <div className="flex items-center gap-2 text-textPrimary">
          <div
            className={cn(
              "flex justify-center items-center",
              "bg-neutral100 border border-neutral400 rounded-md w-[28px] h-[28px]",
              "cursor-pointer",
            )}
            onClick={() => setShowSetIdentityPopup(true)}
          >
            <Tooltip content="Edit">
              <SystemEdit2 className="w-[16px] h-[16px]" />
            </Tooltip>
          </div>
          <Tooltip content="Clear">
            <RemoveButton disabled={isSubmitting} onClick={doSubmit} />
          </Tooltip>
        </div>
      </div>

      {showSetIdentityPopup && (
        <SetIdentityPopup onClose={() => setShowSetIdentityPopup(false)} />
      )}
      <Divider className="my-4" />
      <PropList subMyIdentityInfo={subMyIdentityInfo} />
      {/* <Divider className="my-4" /> */}
      {isSubIdentity && (
        <>
          <PropListWrapper className="space-y-2 ml-14">
            <div className="flex">
              <PropListLabel>Parent</PropListLabel>
              <PropListValue>
                <AddressUser
                  className="ml-1.5"
                  add={parent}
                  showAvatar={false}
                />
              </PropListValue>
            </div>
          </PropListWrapper>
          {/* <Divider className="my-4" /> */}
        </>
      )}
      {/* <RightWrapper>
        <SecondaryButton
          className="w-auto"
          onClick={() => setShowRequestJudgementPopup(true)}
        >
          Request Judgement
        </SecondaryButton>
      </RightWrapper> */}
      {/* {showRequestJudgementPopup && (
        <RequestJudgementPopup
          onClose={() => setShowRequestJudgementPopup(false)}
        />
      )} */}
    </>
  );
}

const PropListWrapper = tw.div`
space-y-2 ml-14
`;

const PropListLabel = tw.div`
text14Medium text-textTertiary w-60
`;

const PropListValue = tw.div`
text14Medium text-textPrimary
`;

function PropList({ subMyIdentityInfo }) {
  const list = [
    { label: "Display Name", valueKey: "display" },
    { label: "Legal Name", valueKey: "legal" },
    { label: "Email", valueKey: "email" },
    { label: "Website", valueKey: "web" },
    { label: "Twitter", valueKey: "twitter" },
    { label: "Discord", valueKey: "discord" },
    { label: "Matrix Name", valueKey: "matrix" },
    { label: "Github Name", valueKey: "github" },
  ];
  return (
    <PropListWrapper className="space-y-2 ml-14">
      {list.map((item) => (
        <div key={item.label} className="flex">
          <PropListLabel>{item.label}</PropListLabel>
          <PropListValue>
            {subMyIdentityInfo[item.valueKey] ?? "-"}
          </PropListValue>
        </div>
      ))}
    </PropListWrapper>
  );
}
