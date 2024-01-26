import Identicon from "@osn/polkadot-react-identicon";
import styled from "styled-components";
import { useThemeSetting } from "../context/theme";
import makeBlockie from "ethereum-blockies-base64";
import { isEthereumAddress } from "@polkadot/util-crypto";
import { isPolkadotAddress } from "next-common/utils/viewfuncs";
import isNil from "lodash.isnil";
import {
  SystemSignalActiveDark,
  SystemSignalActiveLight,
  SystemSignalInactiveDark,
  SystemSignalInactiveLight,
} from "@osn/icons/subsquare";
import Tooltip from "./tooltip";

const StyledIdenticon = styled(Identicon)`
  circle:first-child {
    fill: var(--neutral300);
  }
`;

export default function Avatar({ address, size = 24, active }) {
  const hasActiveIndicator = !isNil(active);

  const themeObj = useThemeSetting();
  const theme = "polkadot";

  let content;

  if (isEthereumAddress(address)) {
    content = (
      <img
        className="w-4/5 h-4/5 rounded-[inherit]"
        src={makeBlockie(address)}
        alt={address}
      />
    );
  }

  if (isPolkadotAddress(address)) {
    content = (
      <StyledIdenticon
        value={address}
        size={size}
        theme={theme}
        themeObj={themeObj}
      />
    );
  }

  if (!content) {
    return null;
  }

  return (
    <div
      className="relative inline-flex items-center justify-center bg-neutral200 rounded-full"
      style={{
        width: size,
        height: size,
      }}
    >
      {content}

      {hasActiveIndicator && (
        <Tooltip
          className="absolute right-0 bottom-0"
          content={active ? "Active" : "Inactive"}
        >
          {active && (
            <>
              <SystemSignalActiveLight className="dark:hidden" />
              <SystemSignalActiveDark className="hidden dark:block" />
            </>
          )}

          {!active && (
            <>
              <SystemSignalInactiveLight className="dark:hidden" />
              <SystemSignalInactiveDark className="hidden dark:block" />
            </>
          )}
        </Tooltip>
      )}
    </div>
  );
}
