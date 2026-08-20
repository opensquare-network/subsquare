import ChainIcon from "next-common/components/header/chainIcon";
import ExternalLink from "next-common/components/externalLink";
import {
  ActiveTag,
  NegativeTag,
  PositiveTag,
  WarningTag,
} from "next-common/components/tags/state/styled";
import TimeAge from "next-common/components/time/timeAge";
import AddressUser from "next-common/components/user/addressUser";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import capitalize from "next-common/utils/capitalize";
import { getChainSettingsPolyfill } from "next-common/utils/consts/settingsPolyfill";
import { getParachainChain } from "next-common/utils/xcm/parachains";
import { useMemo, useState } from "react";

const ACTION_LABELS = {
  transfer: "Transfer",
  teleport: "Teleport",
  swap: "Swap",
  transact: "Transact",
  queryResponse: "Query Response",
};

const STATUS_LABELS = {
  sent: "Pending",
  received: "Completed",
  timeout: "Timed out",
  failed: "Failed",
};

const STATUS_TAGS = {
  received: PositiveTag,
  failed: NegativeTag,
  timeout: WarningTag,
  sent: ActiveTag,
};

const STATIC_COLUMNS = [
  {
    name: "Action",
    style: { flex: 0.7, minWidth: 0 },
    render: (journey) => ACTION_LABELS[journey?.type] || "",
  },
  {
    name: "From",
    style: { flex: 1.2, minWidth: 0 },
    render: (journey) => (
      <ChainAccount
        chain={journey?.origin}
        address={journey?.fromFormatted || journey?.from}
        xcscanUrl={getXcscanUrl(journey)}
      />
    ),
  },
  {
    name: "To",
    style: { flex: 1.2, minWidth: 0 },
    render: (journey) => (
      <ChainAccount
        chain={journey?.destination}
        address={journey?.toFormatted || journey?.to}
        xcscanUrl={getXcscanUrl(journey)}
      />
    ),
  },
  {
    name: "Assets",
    className: "text-right",
    style: { flex: 1, minWidth: 0 },
    render: (journey) => <AssetCell assets={journey?.assets} />,
  },
  {
    name: "Status",
    className: "text-right",
    style: { flex: 0.8, minWidth: 0 },
    render: (journey) => <StatusCell status={journey?.status} />,
  },
];

export function useColumnsDef() {
  const [isTime, setIsTime] = useState(false);

  return useMemo(
    () => [
      {
        name: (
          <button
            className="text-theme500"
            onClick={() => setIsTime((value) => !value)}
          >
            {isTime ? "Time" : "Age"}
          </button>
        ),
        style: { flex: 1.2, minWidth: 0 },
        render: (journey) => (
          <TimeAge
            isTime={isTime}
            time={journey?.sentAt || journey?.createdAt}
          />
        ),
      },
      ...STATIC_COLUMNS,
    ],
    [isTime],
  );
}

function getXcscanUrl(journey) {
  return journey?.correlationId
    ? `https://xcscan.io/tx/#${encodeURIComponent(journey.correlationId)}`
    : null;
}

function getChainInfo(chainId) {
  if (!chainId) {
    return { chain: null, label: null };
  }

  const [, , ecosystem = "", chainIdNumber = ""] = chainId.split(":");
  if (!ecosystem || !chainIdNumber) {
    return { chain: null, label: chainId };
  }

  const paraId = Number(chainIdNumber);

  const knownChain = getParachainChain(ecosystem, paraId);
  if (knownChain) {
    return {
      chain: knownChain,
      label: getChainSettingsPolyfill(knownChain).name,
    };
  }

  const suffix = chainIdNumber === "0" ? "" : ` ${chainIdNumber}`;
  return {
    chain: null,
    label: `${capitalize(ecosystem)}${suffix}`,
  };
}

function ChainAccount({ chain, address, xcscanUrl }) {
  const shouldRenderAddress =
    typeof address === "string" && !address.startsWith("urn");
  const { chain: projectChain, label } = getChainInfo(chain);
  const chainContent = (
    <span className="inline-flex items-center gap-x-1 text14Medium h-6">
      {projectChain && (
        <ChainIcon chain={projectChain} className="!h-5 !w-5 shrink-0" />
      )}
      <span className="text-textPrimary">{label}</span>
    </span>
  );

  return (
    <div className={shouldRenderAddress ? "space-y-2" : undefined}>
      {xcscanUrl ? (
        <ExternalLink
          className="!text-textPrimary"
          externalIcon={false}
          href={xcscanUrl}
          title="View transaction on Xcscan"
        >
          {chainContent}
        </ExternalLink>
      ) : (
        chainContent
      )}
      {shouldRenderAddress && <AddressUser add={address} maxWidth={160} />}
    </div>
  );
}

function AssetCell({ assets = [] }) {
  return (
    <div className="flex flex-col items-end gap-y-1">
      {assets.map((asset, index) => (
        <ValueDisplay
          key={`${asset?.symbol}-${index}`}
          value={toPrecision(asset?.amount ?? 0, asset?.decimals)}
          symbol={asset?.symbol}
        />
      ))}
    </div>
  );
}

function StatusCell({ status }) {
  const Tag = STATUS_TAGS[status];
  if (!Tag) {
    return null;
  }

  return <Tag>{STATUS_LABELS[status]}</Tag>;
}
