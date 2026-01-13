import { useChainSettings } from "next-common/context/chain";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useAddressVestingData from "next-common/hooks/useAddressVestingData";
import { toPrecision } from "next-common/utils";
import { PromptTypes } from "next-common/components/scrollPrompt";
import Link from "next-common/components/link";
import ValueDisplay from "next-common/components/valueDisplay";
import { ScrollPromptItemWrapper } from "next-common/components/scrollPrompt";
import { isEmpty } from "lodash-es";
import { CACHE_KEY } from "next-common/utils/constants";
import { useCookieValue } from "next-common/utils/hooks/useCookieValue";
import { useMemo } from "react";

function useVestingUnlockablePrompt(realAddress) {
  const [visible, setVisible] = useCookieValue(
    CACHE_KEY.vestingUnlockablePrompt,
    true,
  );

  const { decimals, symbol } = useChainSettings();
  const { data, isLoading } = useAddressVestingData(realAddress);

  const unlockable = data?.unlockable;

  return useMemo(() => {
    if (!visible) {
      return {};
    }

    if (isLoading || !unlockable || BigInt(unlockable) <= 0n) {
      return {};
    }

    return {
      key: CACHE_KEY.vestingUnlockablePrompt,
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
      close: () => setVisible(false, { expires: 15 }),
    };
  }, [
    decimals,
    isLoading,
    realAddress,
    setVisible,
    symbol,
    unlockable,
    visible,
  ]);
}

function VestingUnlockablePromptImpl({ realAddress, onClose }) {
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
    <VestingUnlockablePromptImpl realAddress={realAddress} onClose={onClose} />
  );
}
