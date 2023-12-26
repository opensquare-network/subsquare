import { useChainSettings } from "next-common/context/chain";
import ListLayout from "./ListLayout";
import PrimaryButton from "next-common/components/buttons/primaryButton";
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
      label: "Subsquare",
      url: "/discussions",
    },
    {
      label: "Polkassembly",
      url: "/polkassembly/discussions",
    },
  ];

  return (
    <ListLayout
      tabs={chainSettings.hasPolkassemblyDiscussions && tabs}
      summaryFooter={
        <div className="flex justify-end">
          <PrimaryButton
            small
            icon={
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
