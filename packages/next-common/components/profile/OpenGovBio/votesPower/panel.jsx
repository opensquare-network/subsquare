import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import { useTheme } from "styled-components";

export default function VotesPowerPanelWrapper({ children }) {
  const { isDark } = useTheme();

  const backgroundImage = isDark
    ? "linear-gradient(180deg, rgba(30, 33, 48, 0.80) 0%, rgba(30, 33, 48, 0.00) 100%)"
    : "linear-gradient(180deg, rgba(246, 247, 250, 0.80) 0%, rgba(246, 247, 250, 0.00) 100%)";

  return (
    <GreyPanel
      className={
        "flex flex-col bg-neutral100 justify-end text14Medium text-textPrimary p-3 pb-0 max-w-full rounded-[12px] gap-y-2"
      }
      style={{
        backgroundImage,
      }}
    >
      {children}
    </GreyPanel>
  );
}
