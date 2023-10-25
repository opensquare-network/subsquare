import Link from "next/link";
import { SystemTip } from "@osn/icons/subsquare";
import ChainSocialLinks from "next-common/components/chain/socialLinks";

export function SubscribeTip() {
  return (
    <Link
      className="flex gap-1 items-center p-[6px] bg-theme100 rounded-[16px] overflow-hidden"
      href="/settings/notification"
    >
      <div className="inline-flex">
        <SystemTip className="[&_path]:fill-theme500" width={20} height={20} />
      </div>
      <span className="text-[14px] leading-[20px] whitespace-nowrap text-theme500">
        <span className="underline text-theme500 font-medium">Subscribe</span>{" "}
        on-chain events
      </span>
    </Link>
  );
}

export const TitleExtra = () => (
  <div className="max-md:hidden transition-all h-[32px] w-[32px] hover:w-[224px] [&_span]:hidden [&_span]:hover:inline">
    <SubscribeTip />
  </div>
);

export const HeadContent = () => (
  <div className="flex flex-col gap-[16px]">
    <ChainSocialLinks />
    <div className="md:hidden">
      <SubscribeTip />
    </div>
  </div>
);
