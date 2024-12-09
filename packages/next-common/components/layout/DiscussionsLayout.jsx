import { useChainSettings } from "next-common/context/chain";
import ListLayout from "./ListLayout";
import PrimaryButton from "next-common/lib/button/primary";
import { SystemPlus } from "@osn/icons/subsquare";
import { useRouter } from "next/router";

/**
 * @param {import("./ListLayout").ListLayoutProps} props
 */
export default function DiscussionsLayout(props) {
  const chainSettings = useChainSettings();
  const router = useRouter();

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
          <PrimaryButton
            size="small"
            iconLeft={
              <SystemPlus className="w-4 h-4 [&_path]:fill-textPrimaryContrast" />
            }
            onClick={() => router.push("/posts/create")}
          >
            New Post
          </PrimaryButton>
        </div>
      }
      {...props}
    />
  );
}
