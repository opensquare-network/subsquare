import ThemeModeProvider from "next-common/context/theme";
import { memo } from "react";
import { ContactWithUs } from "next-common/components/layout/errorLayout";

function PartialBoundaryLayout({ icon, title, description }) {
  return (
    <ThemeModeProvider defaultThemeMode="system">
      <div className="flex-1 flex flex-col items-center justify-center p-4 text-textPrimary text14Medium bg-red-100 rounded-[12px] border border-[var(--Color-red300,rgba(244,67,54,0.40))]">
        {icon}

        <div className="flex flex-col items-center py-2">
          <div className="text14Bold">{title}</div>
          <div className="mt-1 text-textTertiary">{description}</div>
          <ContactWithUs className="mt-2" />
        </div>
      </div>
    </ThemeModeProvider>
  );
}
export default memo(PartialBoundaryLayout);
