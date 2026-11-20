import { useChainSettings } from "next-common/context/chain";
import ListLayout from "./ListLayout";
import PrimaryButton from "next-common/lib/button/primary";
import { SystemPlus } from "@osn/icons/subsquare";
import { useRouter } from "next/router";
import Tooltip from "next-common/components/tooltip";
import useIsMuted, { MUTED_TOOLTIP_TEXT } from "next-common/hooks/useIsMuted";

/**
 * @param {import("./ListLayout").ListLayoutProps} props
 */
export default function DiscussionsLayout(props) {
  const chainSettings = useChainSettings();
  const router = useRouter();
  const isMuted = useIsMuted();

  const tabs = [
    {
      value: "subsquare",
      label: "Subsquare",
      url: "/discussions",
    },
    {
      value: "polkassembly",
      label: "Polkassembly",
      url: "/polkassembly/discussions",
    },
  ];

  return (
    <ListLayout
      tabs={chainSettings.integrations?.polkassembly?.discussions && tabs}
      summaryFooter={
        <div className="flex justify-end">
          <Tooltip content={isMuted ? MUTED_TOOLTIP_TEXT : ""}>
            <PrimaryButton
              size="small"
              disabled={isMuted}
              iconLeft={
                <SystemPlus className="w-4 h-4 [&_path]:fill-textPrimaryContrast" />
              }
              onClick={() => router.push("/posts/create")}
            >
              New Post
            </PrimaryButton>
          </Tooltip>
        </div>
      }
      {...props}
    />
  );
}
