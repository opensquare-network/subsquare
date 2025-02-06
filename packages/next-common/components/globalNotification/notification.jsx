import { useCookieValue } from "next-common/utils/hooks/useCookieValue";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import { SystemClose } from "@osn/icons/subsquare";
import { colorStyle } from "next-common/components/scrollPrompt";
import { isNil } from "lodash-es";

export default function Notification({
  cacheKey,
  type,
  children,
  expires = 15,
}) {
  const [visible, setVisible] = useCookieValue(cacheKey, true);

  if (!visible) {
    return null;
  }

  return (
    <div className="w-full bg-theme500 flex justify-center px-6">
      <div className="max-w-[1200px] w-full">
        <GreyPanel className="bg-theme500 text14Medium py-2.5 px-6 flex items-center justify-center rounded-none text-textPrimaryContrast relative">
          <div>{children}</div>
          <SystemClose
            className="w-5 h-5 absolute max-sm:right-0 right-[54px]"
            role="button"
            onClick={() => {
              const cookieOptions = {};
              if (!isNil(expires)) {
                cookieOptions.expires = expires;
              }
              setVisible(false, cookieOptions);
            }}
          />
        </GreyPanel>
      </div>
    </div>
  );
}
