import { InfoMessage } from "next-common/components/setting/styled";

const CROSS_CHAIN_DESC =
  "Transfer assets between various parachains connected to Asset Hub";

const TRANSFER_DESC = "Transfer different assets within AssetHub";

export default function Description({ type }) {
  const content = type === "transfer" ? TRANSFER_DESC : CROSS_CHAIN_DESC;
  return (
    <div>
      <InfoMessage>{content}</InfoMessage>
    </div>
  );
}
