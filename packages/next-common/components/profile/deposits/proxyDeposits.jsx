import DepositTemplate from "next-common/components/myDeposits/depositTemplate";

// TODO: table
export default function ProxyDeposits({ deposits }) {
  return (
    <div>
      <DepositTemplate
        activeCount={deposits.length}
        loading={false}
        name="Proxy"
      >
        proxy table.
      </DepositTemplate>
    </div>
  );
}
