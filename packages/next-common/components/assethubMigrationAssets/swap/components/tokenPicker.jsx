import Popup, { PopupSize } from "next-common/components/popup/wrapper/Popup";
import { SearchInput } from "next-common/components/assethubMigrationAssets/useSearchAssets";
import LoadableContent from "next-common/components/common/loadableContent";
import { useChain, useChainSettings } from "next-common/context/chain";
import ValueDisplay from "next-common/components/valueDisplay";
import SecondaryButton from "next-common/lib/button/secondary";
import { getRelayChain } from "next-common/utils/chain";
import { getForeignAssetOrigin } from "next-common/utils/xcm/foreignAsset";
import { toPrecision } from "next-common/utils";
import { useMemo, useState } from "react";
import { useSwap } from "../context/swap";
import useTokenBalance from "../hooks/useTokenBalance";
import TokenIcon from "./tokenIcon";

function getTokenDescription(token, chainName, relay) {
  if (token.type === "asset") {
    return `#${token.assetId}`;
  }

  if (token.type === "foreign") {
    return getForeignAssetOrigin(token.location, relay);
  }

  return chainName;
}

function getTokenType(token) {
  if (token.type === "asset") return "Asset";
  if (token.type === "foreign") return "Foreign asset";
  return "Native";
}

function getTokenMeta(token, chainName, relay) {
  return `${getTokenType(token)} · ${getTokenDescription(token, chainName, relay)}`;
}

function TokenOption({
  address,
  token,
  chainName,
  relay,
  selected,
  onSelect,
}) {
  const meta = getTokenMeta(token, chainName, relay);
  const { balance, error, loading } = useTokenBalance({ address, token });

  return (
    <button
      className={`flex w-full items-center gap-2 px-2 py-3 text-left ${
        selected ? "bg-neutral200" : "hover:bg-neutral200"
      }`}
      onClick={() => onSelect(token)}
      aria-pressed={selected}
      type="button"
    >
      <TokenIcon className="h-8 w-8 shrink-0" token={token} />
      <span className="min-w-0 flex-1">
        <span className="flex min-w-0 items-center gap-2">
          <span className="truncate text14Medium text-textPrimary">
            {token.symbol}
          </span>
          {token.name && (
            <span className="truncate text12Normal text-textTertiary">
              {token.name}
            </span>
          )}
        </span>
        <span className="mt-1 block truncate text12Normal text-textTertiary">
          {meta}
        </span>
      </span>
      <span
        className="shrink-0 text14Medium text-textPrimary"
        title={error ? "Balance unavailable" : undefined}
      >
        <LoadableContent isLoading={loading} size={16}>
          {error || balance == null ? (
            "-"
          ) : (
            <ValueDisplay
              showTooltip={false}
              symbol={token.symbol}
              value={toPrecision(balance, token.decimals)}
            />
          )}
        </LoadableContent>
      </span>
    </button>
  );
}

function TokenPickerPopup({
  chainName,
  relay,
  selectedToken,
  tokens,
  onClose,
  onSelect,
}) {
  const [search, setSearch] = useState("");
  const { address } = useSwap();
  const filteredTokens = useMemo(() => {
    const searchValue = search.trim().toLowerCase();
    const result = !searchValue
      ? tokens
      : tokens.filter((token) => {
          const description = getTokenMeta(token, chainName, relay);
          return [
            token.symbol,
            token.name,
            token.key,
            token.assetId,
            description,
          ]
            .filter(Boolean)
            .some((value) =>
              String(value).toLowerCase().includes(searchValue),
            );
        });

    return result;
  }, [chainName, relay, search, tokens]);

  return (
    <Popup
      computerClassName="h-[680px]"
      mobileClassName="h-[80vh] w-[calc(100vw-32px)]"
      onClose={onClose}
      size={PopupSize.MIDDLE}
      title="Select token"
    >
      <div className="flex h-[calc(680px-72px)] max-h-[calc(80vh-120px)] min-h-0 flex-col gap-4">
        <SearchInput
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search symbol, name, ID or chain"
          value={search}
        />
        <div className="scrollbar-pretty min-h-0 flex-1 overflow-y-auto">
          <div className="mb-2 text12Normal text-textTertiary">
            {filteredTokens.length} token{filteredTokens.length === 1 ? "" : "s"}
          </div>
          {filteredTokens.length > 0 ? (
            <div className="divide-y divide-neutral300 border-y border-neutral300">
              {filteredTokens.map((item) => (
                <TokenOption
                  address={address}
                  chainName={chainName}
                  key={item.key}
                  onSelect={onSelect}
                  relay={relay}
                  selected={item.key === selectedToken?.key}
                  token={item}
                />
              ))}
            </div>
          ) : (
            <div className="px-3 py-12 text-center text14Medium text-textTertiary">
              No matching tokens
            </div>
          )}
        </div>
      </div>
    </Popup>
  );
}

export default function TokenPicker({
  disabled = false,
  onChange,
  token,
  tokens,
}) {
  const chain = useChain();
  const { name: chainName } = useChainSettings();
  const relay = getRelayChain(chain);
  const [showPopup, setShowPopup] = useState(false);

  const handleSelect = (nextToken) => {
    onChange(nextToken);
    setShowPopup(false);
  };

  return (
    <>
      <SecondaryButton
        className="max-w-[180px] gap-2 text-left disabled:cursor-not-allowed"
        disabled={disabled}
        onClick={() => setShowPopup(true)}
        type="button"
      >
        {token && <TokenIcon className="h-5 w-5 shrink-0" token={token} />}
        <span className="min-w-0 truncate text14Medium text-textPrimary">
          {token ? token.symbol : "Select"}
        </span>
      </SecondaryButton>
      {showPopup && (
        <TokenPickerPopup
          chainName={chainName}
          onClose={() => setShowPopup(false)}
          onSelect={handleSelect}
          relay={relay}
          selectedToken={token}
          tokens={tokens}
        />
      )}
    </>
  );
}
