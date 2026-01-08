import { useChainSettings } from "next-common/context/chain";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useAddressVestingData from "next-common/hooks/useAddressVestingData";
import { toPrecision } from "next-common/utils";
import { PromptTypes } from "next-common/components/scrollPrompt";
import Link from "next-common/components/link";
import ValueDisplay from "next-common/components/valueDisplay";
import { createGlobalState } from "react-use";
import { ScrollPromptItemWrapper } from "next-common/components/scrollPrompt";
import { isEmpty } from "lodash-es";

const useMode = createGlobalState(true);

function useVestingUnlockablePrompt(realAddress) {
  const [visible, setVisible] = useMode(true);
  const { decimals, symbol } = useChainSettings();
  const { data, isLoading } = useAddressVestingData(realAddress);

  if (!visible) {
    return {};
  }

  const unlockable = data?.unlockable;
  if (isLoading || !unlockable || BigInt(unlockable) <= 0n) {
    return {};
  }

  return {
    key: "VestingUnlockablePrompt",
    message: (
      <div>
        You have&nbsp;
        {
          <ValueDisplay
            className="text14Bold"
            value={toPrecision(unlockable.toString(), decimals)}
            decimals={decimals}
          />
        }
        &nbsp;{symbol} unlockable from vesting, vest it&nbsp;
        <Link className="underline" href={`/user/${realAddress}/vesting`}>
          here
        </Link>
      </div>
    ),
    type: PromptTypes.INFO,
    close: () => setVisible(false),
  };
}

function VestingUnlockablePromptWithAddress({ realAddress, onClose }) {
  const prompt = useVestingUnlockablePrompt(realAddress);
  if (isEmpty(prompt)) {
    return null;
  }

  return (
    <ScrollPromptItemWrapper
      prompt={{
        ...prompt,
        close: () => {
          onClose?.();
          prompt?.close?.();
        },
      }}
    />
  );
}

export default function VestingUnlockablePrompt({ onClose }) {
  const { modules } = useChainSettings();
  const realAddress = useRealAddress();
  if (!modules?.vesting || !realAddress) {
    return null;
  }

  return (
    <VestingUnlockablePromptWithAddress
      realAddress={realAddress}
      onClose={onClose}
    />
  );
}
