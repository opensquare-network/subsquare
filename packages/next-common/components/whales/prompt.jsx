import { SecondaryCard } from "../styled/containers/secondaryCard";

export default function WhalesPrompt() {
  return (
    <SecondaryCard>
      <ul className="list-disc text14Medium text-textPrimary">
        <li>
          {"Addresses that have ever voted >= 1M DOT are defined as whales."}
        </li>
        <li>The list is refreshed every 10 minutes.</li>
      </ul>
    </SecondaryCard>
  );
}
