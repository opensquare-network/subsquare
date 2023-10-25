import { useRouter } from "next/router";
import { SystemTip } from "@osn/icons/subsquare";
import ChainSocialLinks from "next-common/components/chain/socialLinks";
import { useUser } from "next-common/context/user";
import { useLoginPopup } from "next-common/hooks/useLoginPopup";
import { useCallback } from "react";

export function SubscribeTip() {
  const router = useRouter();
  const user = useUser();
  const { openLoginPopup } = useLoginPopup();

  const goSubscriptionSetting = useCallback(() => {
    const url = "/settings/notifications";
    if (user) {
      router.push(url);
      return;
    }
    openLoginPopup(url);
  }, [user]);

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
    <div className="md:hidden">
      <SubscribeTip />
    </div>
  </div>
);
