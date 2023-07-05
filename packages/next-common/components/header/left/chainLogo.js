import Link from "next/link";
import SubSquare from "../../../assets/header-logos/subsquare.svg";
import SubSquareMobile from "../../../assets/header-logos/subsquare-mobile.svg";
import SubSquareDark from "../../../assets/header-logos/subsquare-dark.svg";
import SubSquareMobileDark from "../../../assets/header-logos/subsquare-mobile-dark.svg";
import { useChainSettings } from "../../../context/chain";
import { useRouter } from "next/router";

const gov2Paths = ["/referenda", "/fellowship"];

function useHeaderUrl() {
  const router = useRouter();
  const { pathname } = router;

  for (const path of gov2Paths) {
    if (pathname.startsWith(path)) {
      return path;
    }
  }

  return "/";
}

export default function ChainLogo() {
  const chainSetting = useChainSettings();
  const headerUrl = useHeaderUrl();

  const HeaderLogo = chainSetting.headerLogo ?? SubSquare;
  const HeaderLogoDark = chainSetting.darkHeaderLogo ?? SubSquareDark;

  return (
    <div className="flex">
      <Link
        href={headerUrl}
        style={{
          height: "100%",
          display: "flex",
        }}
      >
        <div className="flex max-sm:hidden">
          <HeaderLogo className="dark:hidden" />
          <HeaderLogoDark className="hidden dark:inline-block" />
        </div>

        <div className="sm:hidden max-sm:flex">
          <SubSquareMobile className="dark:hidden" />
          <SubSquareMobileDark className="hidden dark:inline-block" />
        </div>
      </Link>
    </div>
  );
}
