import { useRouter } from "next/router";
import { SystemTip } from "@osn/icons/subsquare";
import ChainSocialLinks from "next-common/components/chain/socialLinks";
import { useCallback } from "react";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";
import CoretimeStats from "next-common/components/overview/coretimeStats";

export function SubscribeTip() {
  const router = useRouter();
  const { ensureLogin } = useEnsureLogin();

  const goSubscriptionSetting = useCallback(async () => {
    if (!(await ensureLogin())) {
      return;
    }
    router.push("/settings/notifications");
  }, [ensureLogin, router]);

  return (
    <div
      className="flex cursor-pointer gap-1 items-center p-[6px] bg-theme100 rounded-[16px] overflow-hidden"
      onClick={goSubscriptionSetting}
    >
      <div className="inline-flex">
        <SystemTip className="[&_path]:fill-theme500" width={20} height={20} />
      </div>
      <span className="text-[14px] leading-[20px] whitespace-nowrap text-theme500">
        <span className="underline text-theme500 font-medium">Subscribe</span>{" "}
        on-chain events
      </span>
    </div>
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
    <CoretimeStats />
    <div className="md:hidden">
      <SubscribeTip />
    </div>
  </div>
);
