import useSubCoreCollectivesMember from "next-common/hooks/collectives/useSubCoreCollectivesMember";

function NotImportedSalary() {
  return (
    <div className="flex flex-col w-full pt-[24px] border-t border-neutral300 gap-[12px]">
      <div className="flex flex-col items-center gap-[4px]">
        <span className="text14Medium text-textTertiary">Salary</span>
        <span className="text16Bold text-textPrimary">-</span>
      </div>
    </div>
  );
}

function MemberSalary() {
  return (
    <div className="flex flex-col w-full pt-[24px] border-t border-neutral300 gap-[12px]">
      <div className="flex flex-col items-center gap-[4px]">
        <span className="text14Medium text-textTertiary">Salary</span>
        <span className="text16Bold text-textPrimary">≈16.67K USDT</span>
        <span className="text12Medium text-textTertiary">
          Last payment 20d ago
        </span>
      </div>
    </div>
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
