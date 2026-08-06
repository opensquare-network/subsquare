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

function AllMembersButton({ section }) {
  return (
    <NavigateButton
      icon={
        <MenuFellowship className="w-[16px] h-[16px] [&_path]:fill-textTertiary" />
      }
      href={`https://collectives.subsquare.io/${section}/members`}
    >
      All Members
    </NavigateButton>
  );
}

function SalaryCyclesButton({ section }) {
  return (
    <NavigateButton
      icon={
        <MenuAsset className="w-[16px] h-[16px] [&_path]:fill-textTertiary" />
      }
      href={`https://collectives.subsquare.io/${section}/salary`}
    >
      Salary Cycles
    </NavigateButton>
  );
}

export default function NavigationButtons({ section = "fellowship" }) {
  return (
    <div className="flex gap-[8px] mt-[8px]">
      <AllMembersButton section={section} />
      <SalaryCyclesButton section={section} />
    </div>
  );
}
