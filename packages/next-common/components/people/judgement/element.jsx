import { LinkElement } from "@osn/icons/subsquare";
import { ClosedTag } from "next-common/components/tags/state/styled";
import PrimaryButton from "next-common/lib/button/primary";
import SecondaryButton from "next-common/lib/button/secondary";
import Copyable from "next-common/components/copyable";

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
        <PrimaryButton size="small">Verify</PrimaryButton>
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
          <a
            className="text-textTertiary "
            href="https://matrix.to/#/#Subsquare-Identity-Verify:matrix.org"
          >
            #Subsquare-Identity-Verify:matrix.org
          </a>
          <SecondaryButton size="small">copy</SecondaryButton>
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
