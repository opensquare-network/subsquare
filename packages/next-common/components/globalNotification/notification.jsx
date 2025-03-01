import { useCookieValue } from "next-common/utils/hooks/useCookieValue";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import { SystemClose } from "@osn/icons/subsquare";
import { isNil } from "lodash-es";

export default function Notification({ cacheKey, children, expires = 15 }) {
  const [visible, setVisible] = useCookieValue(cacheKey, true);

  if (!visible) {
    return null;
  }

  return (
    <div className="w-full bg-theme500 flex justify-center">
      <div className="px-6 py-2.5 mx-auto max-w-[1200px] max-sm:px-0 flex-1">
        <div className="w-full px-6">
          <GreyPanel className="flex justify-between items-start flex-row bg-theme500 text14Medium rounded-none text-textPrimaryContrast">
            <div className="flex-1 justify-center items-center text-center">
              {children}
            </div>
            <SystemClose
              className="w-5 h-5 shrink-0 mr-[6px]"
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
    </div>
  );
}
