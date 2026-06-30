"use client";

import RecoverySubTabs from "next-common/components/recovery/subTabs";

export default function InheritorsContent() {
  return (
    <div className="flex flex-col gap-6">
      <RecoverySubTabs className="mx-6" activeTab="inheritors" />
      <div className="text14Medium text-textTertiary">
        Inheritants placeholder content. View recovery configurations where you
        are designated as an inheritor.
      </div>
    </div>
  );
}
