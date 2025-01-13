import { cn } from "next-common/utils";
import { SecondaryCard } from "./styled/containers/secondaryCard";

function BillBoardPanelWrapper({ icon, children, className }) {
  return (
    <SecondaryCard
      className={cn(
        "flex !p-6 gap-x-4",
        "max-sm:flex-col max-sm:gap-y-3",
        className,
      )}
    >
      <div className="w-10 h-10 bg-theme100 rounded-lg flex items-center justify-center">
        {icon}
      </div>

      <div className="pl-6">{children}</div>
    </SecondaryCard>
  );
}

function LoadingBar() {
  return (
    <div
      className={cn(
        "w-[320px] h-[20px] my-[4px] rounded-[4px]",
        "bg-gradient-to-r from-[rgba(235,238,244,0.8)] to-[rgba(235,238,244,0.2)]",
      )}
    />
  );
}

function BillBoardPanelLoading({ icon, className }) {
  return (
    <BillBoardPanelWrapper icon={icon} className={className}>
      <div className="flex flex-col gap-[4px]">
        <LoadingBar />
        <LoadingBar />
        <LoadingBar />
      </div>
    </BillBoardPanelWrapper>
  );
}

export default function BillBoardPanel({
  className,
  icon,
  items = [],
  isLoading,
}) {
  if (isLoading) {
    return <BillBoardPanelLoading icon={icon} className={className} />;
  }

  if (!items.length) {
    return null;
  }

  return (
    <BillBoardPanelWrapper icon={icon} className={className}>
      <ul className="list-disc text14Medium text-textPrimary space-y-1">
        {items.map((item, index) => (
          <li key={index}>
            <div className="flex items-center flex-wrap">{item}</div>
          </li>
        ))}
      </ul>
    </BillBoardPanelWrapper>
  );
}
