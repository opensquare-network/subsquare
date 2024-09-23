import { SystemPlus } from "@osn/icons/subsquare";
import PrimaryButton from "next-common/lib/button/primary";
import NoData from "next-common/components/noData";
import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import { useChainSettings } from "next-common/context/chain";
import { useRouter } from "next/router";

export default function EmptyRecentProposals() {
  const router = useRouter();
  const chainSettings = useChainSettings();

  function handleNewDiscussion() {
    router.push("/posts/create");
  }

  return (
    <NeutralPanel className="py-12">
      <div>
        <NoData
          className="p-0"
          head="No proposals recently"
          text={
            <span className="whitespace-nowrap">
              Recent proposals will be displayed on this page.
              <br /> Any ideas? Start a discussion.
            </span>
          }
        />

        {chainSettings.modules?.discussions && (
          <div className="mt-4 text-center">
            <PrimaryButton
              onClick={handleNewDiscussion}
              iconLeft={
                <SystemPlus className="w-4 h-4 [&_path]:fill-textPrimaryContrast" />
              }
            >
              New Discussion
            </PrimaryButton>
          </div>
        )}
      </div>
    </NeutralPanel>
  );
}
