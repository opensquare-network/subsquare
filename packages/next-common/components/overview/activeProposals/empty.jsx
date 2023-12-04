import { SystemPlus } from "@osn/icons/subsquare";
import PrimaryButton from "next-common/components/buttons/primaryButton";
import NoData from "next-common/components/noData";
import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import { useIsLogin } from "next-common/context/user";
import { useLoginPopup } from "next-common/hooks/useLoginPopup";
import { useRouter } from "next/router";

export default function EmptyRecentProposals() {
  const { openLoginPopup } = useLoginPopup();
  const isLogin = useIsLogin();
  const router = useRouter();

  function handleNewDiscussion() {
    if (!isLogin) {
      openLoginPopup();
      return;
    }

    router.push("/posts/create");
  }

  return (
    <NeutralPanel className="py-12">
      <div>
        <NoData
          className="p-0"
          head="OOPS! Can't find any proposals"
          text={
            <span className="whitespace-nowrap">
              Recent proposals will be displayed on this page.
              <br /> Any ideas? Start a discussion.
            </span>
          }
        />

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
      </div>
    </NeutralPanel>
  );
}
