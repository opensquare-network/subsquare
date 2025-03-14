import useSubCoreCollectivesMember from "next-common/hooks/collectives/useSubCoreCollectivesMember";

function Wrapper({ children }) {
  return (
    <div className="flex flex-col w-full pt-[24px] border-t border-neutral300 gap-[12px]">
      <div className="flex flex-col items-center gap-[4px]">{children}</div>
    </div>
  );
}

function NotImportedSalary() {
  return (
    <Wrapper>
      <span className="text14Medium text-textTertiary">Salary</span>
      <span className="text16Bold text-textTertiary">-</span>
    </Wrapper>
  );
}

function MemberSalary() {
  return (
    <Wrapper>
      <span className="text14Medium text-textTertiary">Salary</span>
      <span className="text16Bold text-textPrimary">≈16.67K USDT</span>
      <span className="text12Medium text-textTertiary">
        Last payment 20d ago
      </span>
    </Wrapper>
  );
}

export default function Salary({ address }) {
  const { member, isLoading } = useSubCoreCollectivesMember(address);

  if (isLoading) {
    return null;
  }

  if (!member) {
    return <NotImportedSalary />;
  }

  return <MemberSalary />;
}
