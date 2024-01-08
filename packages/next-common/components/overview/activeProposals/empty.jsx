import { SystemPlus } from "@osn/icons/subsquare";
import PrimaryButton from "next-common/components/buttons/primaryButton";
import NoData from "next-common/components/noData";
import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import { useChainSettings } from "next-common/context/chain";
import { useRouter } from "next/router";

export default function EmptyRecentProposals() {
  const router = useRouter();
  const chainSettings = useChainSettings();
  const hasDiscussions = chainSettings.hasDiscussions !== false;

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

        {hasDiscussions && (
          <div className="mt-4 text-center">
            <PrimaryButton
              onClick={handleNewDiscussion}
              icon={
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
