import { useChainSettings } from "next-common/context/chain";

export default function ChainInfo() {
  const chainSettings = useChainSettings();

  return (
    <div>
      <h3 className="text20Bold text-textPrimary">{chainSettings.name}</h3>
      <p className="text14Medium text-textTertiary">chain description</p>

      <ul className="flex gap-x-3 mt-2">
        <li>icon1</li>
        <li>icon2</li>
      </ul>
    </div>
  );
}
