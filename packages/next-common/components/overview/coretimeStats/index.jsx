import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import { useChainSettings } from "next-common/context/chain";
import { colorStyle, PromptTypes } from "next-common/components/scrollPrompt";
import Link from "next-common/components/link";
import { SystemClose } from "@osn/icons/subsquare";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import useCoretimeCurrentSale from "./useCoretimeCurrentSale";
import { isNil } from "lodash-es";
import usePromptVisibility from "next-common/hooks/usePromptVisibility";

const STORAGE_KEY = "coretime-stats-closed";

function Separator() {
  return <span className="mx-2">·</span>;
}

function Prompt({ onClose, coresOffered, availableCores, totalRevenue }) {
  const { decimals, symbol } = useChainSettings();

  const contentItems = [
    {
      key: "cores",
      content: (
        <>
          <span>Available cores for sale</span>
          <span className="text14Bold ml-1">{availableCores}</span>
          <span className="mx-[2px]">/</span>
          <span>{coresOffered}</span>
        </>
      ),
    },
    {
      key: "revenue",
      content: (
        <>
          <span>Current revenue</span>
          <ValueDisplay
            value={toPrecision(totalRevenue, decimals)}
            symbol={symbol}
            className="text-textSecondary text14Bold ml-1"
          />
        </>
      ),
    },
    {
      key: "link",
      content: (
        <>
          <span>Check details&nbsp;</span>
          <Link className="underline text14Bold" href="/coretime">
            here
          </Link>
          <span>.</span>
        </>
      ),
    },
  ];

  return (
    <GreyPanel
      className="text14Medium py-2.5 px-4 justify-between"
      style={colorStyle[PromptTypes.NEUTRAL]}
    >
      <div className="flex flex-wrap items-center gap-x-0">
        <span className="mr-2">Coretime:</span>
        {contentItems.map((item, index) => (
          <div key={item.key} className="inline-flex items-center">
            {item.content}
            {index < contentItems.length - 1 && <Separator />}
          </div>
        ))}
      </div>
      <SystemClose
        className="w-5 h-5 flex-shrink-0 ml-2"
        role="button"
        onClick={onClose}
      />
    </GreyPanel>
  );
}

function CoretimeStatsPrompt() {
  const { value, loading } = useCoretimeCurrentSale();
  const { totalRevenue = 0, info = {} } = value || {};
  const { coresOffered = 0, coresSold = 0 } = info;
  const availableCores = coresOffered - coresSold;

  const shouldShow = !loading && !isNil(value);
  const { visible, handleClose } = usePromptVisibility(STORAGE_KEY, shouldShow);

  if (!visible) {
    return null;
  }

  return (
    <Prompt
      onClose={handleClose}
      coresOffered={coresOffered}
      availableCores={availableCores}
      totalRevenue={totalRevenue}
    />
  );
}

export default function CoretimeStats() {
  const { modules } = useChainSettings();
  if (!modules?.coretime) {
    return null;
  }

  return <CoretimeStatsPrompt />;
}
