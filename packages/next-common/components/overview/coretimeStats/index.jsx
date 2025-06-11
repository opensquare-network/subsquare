import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import { useChainSettings } from "next-common/context/chain";
import { colorStyle, PromptTypes } from "next-common/components/scrollPrompt";
import { useEffect, useState } from "react";
import Link from "next/link";
import { SystemClose } from "@osn/icons/subsquare";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import useCoretimeCurrentSale from "./useCoretimeCurrentSale";
import { isNil } from "lodash-es";

function Separator() {
  return <span>&nbsp;·&nbsp;</span>;
}

function Prompt({ setVisible, coresOffered, availableCores, totalRevenue }) {
  const { decimals, symbol } = useChainSettings();

  const contentItems = [
    {
      key: "cores",
      content: (
        <>
          <span>Coretime: Available cores for sale</span>
          <span className="text14Bold">&nbsp;{availableCores}&nbsp;</span>
          <span>/&nbsp;{coresOffered}</span>
        </>
      ),
    },
    {
      key: "revenue",
      content: (
        <>
          <span>Current revenue&nbsp;</span>
          <ValueDisplay
            value={toPrecision(totalRevenue, decimals)}
            symbol={symbol}
            className="text-textSecondary text14Bold"
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
        {contentItems.map((item, index) => (
          <div key={item.key} className="inline-flex items-center">
            {item.content}
            {index < contentItems.length - 1 && <Separator />}
          </div>
        ))}
      </div>
      <SystemClose
        className="w-5 h-5 text-theme500 flex-shrink-0 ml-2"
        role="button"
        onClick={() => {
          setVisible(false);
        }}
      />
    </GreyPanel>
  );
}

function CoretimeStatsPrompt() {
  const [visible, setVisible] = useState(false);
  const { value, loading } = useCoretimeCurrentSale();
  const { totalRevenue = 0, info = {} } = value || {};
  const { coresOffered = 0, coresSold = 0 } = info;
  const availableCores = coresOffered - coresSold;

  useEffect(() => {
    if (loading || isNil(value)) {
      return;
    }

    setVisible(true);
  }, [loading, value]);

  if (!visible) {
    return null;
  }

  return (
    <Prompt
      setVisible={setVisible}
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
