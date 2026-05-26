import CollapsePanel from "../collapsePanel";
import usePendingSpends from "next-common/hooks/treasury/usePendingSpends";
import {
  TodoContent,
  TodoTag,
  TodoWrapper,
} from "../fellowshipTodoList/todoList/styled";
import Link from "next/link";
import { TreasuryProvider } from "next-common/context/treasury";
import { useChainSettings } from "next-common/context/chain";

function Title() {
  return (
    <div className="flex items-center gap-1 text14Medium text-textTertiary">
      <span>Treasury Spend Prompt</span>
    </div>
  );
}

function getSpendActionText(type) {
  return type === "valid" ? "valid" : "expired";
}

function SpendPromptItem({ spend }) {
  return (
    <TodoWrapper>
      <TodoTag>{spend.type === "valid" ? "Valid" : "Expire"}</TodoTag>
      <TodoContent>
        <Link
          className="text-theme500"
          href={`/treasury/spends/${spend.index}`}
        >
          Treasury spend #{spend.index}
        </Link>
        <span>
          &nbsp;will be {getSpendActionText(spend.type)} in{" "}
          {spend.estimatedBlocksTime}
        </span>
      </TodoContent>
    </TodoWrapper>
  );
}

function TreasurySpendPromptImpl() {
  const { pendingSpendPrompts } = usePendingSpends();

  if (!pendingSpendPrompts?.length) {
    return null;
  }

  return (
    <CollapsePanel labelItem={<Title />} defaultCollapsed={false}>
      <div className="flex flex-col gap-1 max-sm:gap-2">
        {pendingSpendPrompts.map((spend) => (
          <SpendPromptItem
            key={`${spend.type}-${spend.index}-${spend.targetHeight}`}
            spend={spend}
          />
        ))}
      </div>
    </CollapsePanel>
  );
}

export default function TreasurySpendPrompt() {
  const { modules } = useChainSettings();

  if (!modules?.treasury?.spends) {
    return null;
  }

  return (
    <TreasuryProvider>
      <TreasurySpendPromptImpl />
    </TreasuryProvider>
  );
}
