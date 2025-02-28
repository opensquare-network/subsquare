import SecondaryButton from "next-common/lib/button/secondary";
import { ArrowRight, MenuAsset, MenuFellowship } from "@osn/icons/subsquare";

function NavigateButton({ icon, href, children }) {
  return (
    <SecondaryButton
      className="text12Medium text-textPrimary p-[6px] h-[28px] rounded-md"
      iconLeft={icon}
      iconRight={
        <ArrowRight className="w-[16px] h-[16px] [&_path]:stroke-textTertiary" />
      }
      onClick={() => window.open(href, "_blank")}
    >
      {children}
    </SecondaryButton>
  );
}

function AllMembersButton() {
  return (
    <NavigateButton
      icon={
        <MenuFellowship className="w-[16px] h-[16px] [&_path]:fill-textTertiary" />
      }
      href="https://collectives.subsquare.io/fellowship/members"
    >
      All Members
    </NavigateButton>
  );
}

function SalaryCyclesButton() {
  return (
    <NavigateButton
      icon={
        <MenuAsset className="w-[16px] h-[16px] [&_path]:fill-textTertiary" />
      }
      href="https://collectives.subsquare.io/fellowship/salary"
    >
      Salary Cycles
    </NavigateButton>
  );
}

export default function NavigationButtons() {
  return (
    <div className="flex gap-[8px] mt-[8px]">
      <AllMembersButton />
      <SalaryCyclesButton />
    </div>
  );
}
