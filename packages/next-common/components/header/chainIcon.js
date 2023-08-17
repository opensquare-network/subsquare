import clsx from "clsx";
import getChainSettings from "../../utils/consts/settings";

function Img({ src, className = "" }) {
  return <img src={src} alt="" className={clsx("logo", className)} />;
}

export default function ChainIcon({ chain }) {
  const chainSetting = getChainSettings(chain);
  let { avatar, darkAvatar } = chainSetting;
  darkAvatar = darkAvatar ?? avatar;

  return (
    <div className="flex items-center w-6 h-6">
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
