import { ArrowExternalLink } from "@osn/icons/subsquare";
import BigNumber from "bignumber.js";
import { isNil } from "lodash-es";
import { toPrecision } from "next-common/utils";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import LoadableContent from "next-common/components/common/loadableContent";
import ValueDisplay from "next-common/components/valueDisplay";
import AddressUser from "next-common/components/user/addressUser";
import Link from "next-common/components/link";
import Tooltip from "next-common/components/tooltip";
import TokenIcon from "next-common/components/assethubMigrationAssets/swap/components/tokenIcon";
import { Location } from "next-common/components/assethubMigrationAssets/foreignAssets/table/columns/id";
import { useDotUsdContext } from "./context";
import usePsmStats from "./usePsmStats";

function Field({ label, titleExtra, children }) {
  return (
    <div className="flex flex-col gap-y-1 min-w-0">
      <div className="inline-flex items-center gap-x-1 text12Medium text-textTertiary">
        {label}
        {titleExtra}
      </div>
      <div className="text14Medium text-textPrimary break-all">{children}</div>
    </div>
  );
}

// Jumps to the records list the flow number is summed from.
function RecordsLink({ href, tooltip }) {
  return (
    <Tooltip className="inline-flex" content={tooltip}>
      <Link
        href={href}
        aria-label={tooltip}
        className="inline-flex items-center text-textTertiary hover:text-textSecondary"
      >
        <ArrowExternalLink className="w-3.5 h-3.5" />
      </Link>
    </Tooltip>
  );
}

function AdminOrigin({ origin }) {
  if (!origin) {
    return <span className="text-textTertiary">—</span>;
  }

  // A signed origin carries an account, governance origins only have a name.
  if (origin.type === "account") {
    return <AddressUser add={origin.account} />;
  }

  return <span>{origin.label}</span>;
}

function Amount({ value, symbol, decimals }) {
  if (isNil(value) || isNil(decimals)) {
    return <span className="text-textTertiary">—</span>;
  }

  return <ValueDisplay value={toPrecision(value, decimals)} symbol={symbol} />;
}

// The net flow keeps its direction visible, so an outflow is not read as an inflow.
function SignedAmount({ value, symbol, decimals }) {
  if (isNil(value) || isNil(decimals)) {
    return <span className="text-textTertiary">—</span>;
  }

  const amount = BigNumber(value);
  const sign = amount.isZero() ? "" : amount.isPositive() ? "+" : "−";

  return (
    <span className="inline-flex items-center gap-x-1">
      {sign && <span>{sign}</span>}
      <Amount
        value={amount.abs().toString()}
        symbol={symbol}
        decimals={decimals}
      />
    </span>
  );
}

export default function DotUsdInstance() {
  const { data, isLoading } = useDotUsdContext();
  const { stats, isLoading: isStatsLoading } = usePsmStats();
  const { index, location, symbol, decimals } = data?.internalAsset ?? {};

  return (
    <SecondaryCard>
      <LoadableContent isLoading={isLoading}>
        <div className="grid grid-cols-2 gap-x-6 gap-y-5 max-sm:grid-cols-1">
          <Field label="Internal asset">
            {isNil(index) ? (
              <span className="text-textTertiary">—</span>
            ) : (
              <span className="inline-flex items-center gap-x-2">
                <TokenIcon token={{ assetId: index, symbol }} />
                <span>{symbol}</span>
                <Location location={location} />
              </span>
            )}
          </Field>

          <Field label="Fee destination">
            {data?.feeDestination ? (
              <AddressUser add={data.feeDestination} link="/assets" />
            ) : (
              <span className="text-textTertiary">—</span>
            )}
          </Field>

          <Field label="Min swap amount">
            <Amount
              value={data?.minSwapAmount}
              symbol={symbol}
              decimals={decimals}
            />
          </Field>

          <Field label="Approved external assets">
            {isNil(data?.externalCount) ? "—" : String(data.externalCount)}
          </Field>

          <Field label="Full admin">
            <AdminOrigin origin={data?.fullAdmin} />
          </Field>

          <Field label="Emergency admin">
            <AdminOrigin origin={data?.emergencyAdmin} />
          </Field>
        </div>

        <div className="mt-5 border-t border-neutral300 pt-5">
          <div className="grid grid-cols-3 gap-x-6 gap-y-5 max-sm:grid-cols-1">
            <Field
              label="24h net minted"
              titleExtra={
                <RecordsLink href="/dotusd/mint" tooltip="View mint records" />
              }
            >
              <LoadableContent isLoading={isStatsLoading}>
                <Amount
                  value={stats?.minted?.amount}
                  symbol={symbol}
                  decimals={decimals}
                />
              </LoadableContent>
            </Field>

            <Field
              label="24h net redeemed"
              titleExtra={
                <RecordsLink
                  href="/dotusd/redeem"
                  tooltip="View redeem records"
                />
              }
            >
              <LoadableContent isLoading={isStatsLoading}>
                <Amount
                  value={stats?.redeemed?.amount}
                  symbol={symbol}
                  decimals={decimals}
                />
              </LoadableContent>
            </Field>

            <Field label="24h net">
              <LoadableContent isLoading={isStatsLoading}>
                <SignedAmount
                  value={stats?.net}
                  symbol={symbol}
                  decimals={decimals}
                />
              </LoadableContent>
            </Field>
          </div>
        </div>
      </LoadableContent>
    </SecondaryCard>
  );
}
