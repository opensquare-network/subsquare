import EscrowCard from "./escrowCard";
import { fetchEscrow } from "next-common/services/escrow";
import { useAsync } from "react-use";
import { useChainSettings } from "next-common/context/chain";

export default function History() {
  const { decimals } = useChainSettings();
  const { value, loading } = useAsync(() => fetchEscrow(decimals), []);
  const { totalSupply, totalStaked, totalAccount } = value || {};

  const list = [
    {
      name: "totalSupply",
      data: totalSupply,
      titleSymbol: "(vINTR)",
    },
    {
      name: "totalStaked",
      data: totalStaked,
      titleSymbol: "(vINTR)",
    },
    {
      name: "totalAccount",
      data: totalAccount,
    },
  ];

  return (
    <div className="flex flex-col gap-[18px]">
      <span className="text16Bold text-textPrimary ml-6">History</span>
      <div className="grid max-sm:grid-cols-1 grid-cols-2 gap-4">
        {list.map((i) => (
          <EscrowCard
            key={i.name}
            data={i.data}
            loading={loading}
            titleSymbol={i.titleSymbol}
          />
        ))}
      </div>
    </div>
  );
}
