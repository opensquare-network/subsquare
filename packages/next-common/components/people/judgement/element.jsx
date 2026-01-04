import { LinkElement } from "@osn/icons/subsquare";
import { ClosedTag } from "next-common/components/tags/state/styled";
import PrimaryButton from "next-common/lib/button/primary";
import Copyable from "next-common/components/copyable";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";

export default function Email() {
  return (
    <div className="w-full space-y-2 text14Medium text-textPrimary">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <div className="flex text16Bold">
            <LinkElement />
            <span className="text-textTertiary mx-1 ml-0">·</span>
            <h1>Element</h1>
          </div>
          <div>
            <ClosedTag>Pending</ClosedTag>
          </div>
        </div>
        <VerifyButton />
      </div>
      <div className="flex gap-4 pb-2">
        <div className="flex items-center ">
          <span className=" text14Bold w-32">Matrix ID:</span>
          <span className="truncate text-textTertiary">@quinn:matrix.org</span>
        </div>
      </div>

      <div>
        <label className=" text12Bold mb-2 block">
          Step 1: Join Verify Room
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <Copyable copyText="XXX-XXX-1234">
            <a
              className="text-theme500 underline "
              href="https://matrix.to/#/#Subsquare-Identity-Verify:matrix.org"
            >
              https://matrix.to/#/#Subsquare-Identity-Verify:matrix.org
            </a>
          </Copyable>
        </div>
      </div>
      <div>
        <label className=" text12Bold mb-2 block">
          Step 2: Send Verification Code in Room
        </label>
        <div className="flex flex-col sm:flex-row gap-2 rounded-md p-2 justify-between items-center">
          <Copyable copyText="XXX-XXX-1234">
            <span className=" text16Bold">XXX-XXX-1234</span>
          </Copyable>
        </div>
      </div>
      <div>
        <label className=" text12Bold mb-2 block">
          Step 3: Click &quot;Verify&quot; to Check Status
        </label>
        <div className="text12Normal flex flex-col sm:flex-row gap-2 rounded-md p-2 justify-between items-center">
          After sending the code in the room, click the &quot;verify&quot;
          button below to check if verification is complete.
        </div>
      </div>
    </div>
  );
}

function VerifyButton() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const verifyCode = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      dispatch(newSuccessToast("Verify element successfully"));
    }, 1500);
  };
  return (
    <PrimaryButton size="small" onClick={verifyCode} loading={loading}>
      Verify
    </PrimaryButton>
  );
}
