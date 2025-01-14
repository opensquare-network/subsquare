import SecondaryButton from "next-common/lib/button/secondary";
import CollapsePanel, { AlwaysVisible } from "./collapsePanel";
import { ArrowRight, MenuAsset, MenuFellowship } from "@osn/icons/subsquare";

function Title() {
  return (
    <div className="flex gap-1 text14Medium text-textTertiary">
      <span>Fellowship To-do List</span>
      <span>·</span>
      <span>0</span>
    </div>
  );
}

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

function TodoList({ children }) {
  return <div className="flex flex-col mt-[16px] gap-[4px]">{children}</div>;
}

function EntranceButtons() {
  return (
    <div className="flex gap-[8px] mt-[8px]">
      <AllMembersButton />
      <SalaryCyclesButton />
    </div>
  );
}

function TodoTag({ children }) {
  return (
    <div className="w-[160px]">
      <div className="inline-flex rounded-[10px] px-[8px] py-[2px] text12Medium text-textSecondary bg-neutral200">
        {children}
      </div>
    </div>
  );
}

function EvidenceTodo() {
  return (
    <div className="flex items-center">
      <TodoTag>Membership</TodoTag>
      <div className="text-textPrimary text14Medium">
        Your demotion period of membership is closing. Submit your evidence for
        retention
      </div>
    </div>
  );
}

export default function FellowshipTodoList() {
  return (
    <CollapsePanel labelItem={<Title />}>
      <AlwaysVisible>
        <EntranceButtons />
      </AlwaysVisible>
      <TodoList>
        <EvidenceTodo />
      </TodoList>
    </CollapsePanel>
  );
}
