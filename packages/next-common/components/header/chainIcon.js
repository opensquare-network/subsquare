import { cn } from "next-common/utils";
import { getChainSettingsPolyfill } from "next-common/utils/consts/settingsPolyfill";

function Img({ src, className = "" }) {
  return <img src={src} alt="" className={cn("logo", className)} />;
}

export default function ChainIcon({ className, chain }) {
  const chainSetting = getChainSettingsPolyfill(chain);
  let { avatar, darkAvatar } = chainSetting;
  darkAvatar = darkAvatar ?? avatar;

  return (
    <div className={cn("inline-flex items-center w-6 h-6", className)}>
      {avatar?.src ? (
        <Img src={avatar.src} className="dark:hidden" />
      ) : (
        <chainSetting.avatar className="logo dark:hidden" />
      )}
      {darkAvatar?.src ? (
        <Img src={darkAvatar.src} className="hidden dark:block" />
      ) : (
        <chainSetting.darkAvatar className="logo hidden dark:block" />
      )}
    </div>
  );
}
