"use client";

import RecoverySubTabs from "next-common/components/recovery/subTabs";

export default function HelpOthersContent() {
  return (
    <div className="flex flex-col gap-6">
      <RecoverySubTabs className="mx-6" activeTab="help_recover" />
      <div className="text14Medium text-textTertiary">
        Help Others placeholder content. View recovery requests from others
        where you are a friend.
      </div>
    </div>
  );
}
