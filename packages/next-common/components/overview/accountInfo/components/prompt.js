import { useCookieValue } from "next-common/utils/hooks/useCookieValue";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import { SystemClose } from "@osn/icons/subsquare";
import { colorStyle } from "next-common/components/scrollPrompt";

export default function Prompt({ cacheKey, type, children }) {
  const [visible, setVisible] = useCookieValue(cacheKey, true);

  if (!visible) {
    return null;
  }

  return (
    <GreyPanel
      className="text14Medium py-2.5 px-4 justify-between"
      style={colorStyle[type]}
    >
      <div>{children}</div>
      <SystemClose
        className="w-5 h-5"
        role="button"
        onClick={() => setVisible(false, { expires: 15 })}
      />
    </GreyPanel>
  );
}
