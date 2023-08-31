import clsx from "clsx";
import ExternalLink from "next-common/components/externalLink";
import { useThemeMode } from "next-common/context/theme";
import {
  ThemeSun,
  ThemeMoon,
  ThemeSystem,
  FooterLogoLight,
  FooterLogoDark,
} from "@osn/icons/subsquare";
import Tooltip from "next-common/components/tooltip";

export default function Footer() {
  const contactLinks = [
    {
      name: "Element",
      link: "https://app.element.io/#/room/#opensquare:matrix.org",
    },
    {
      name: "GitHub",
      link: "https://github.com/opensquare-network/subsquare/issues",
    },
    {
      name: "Email",
      link: "mailto:hi@opensquare.network",
    },
  ];

  return (
    <div
      className={clsx(
        "flex",
        "h-auto px-6 py-4 justify-between items-center",
        "lg:h-[72px]",
        "border-t border-neutral300 bg-neutral100",
        "max-lg:flex-col",
      )}
    >
      <div className={clsx("flex items-center gap-x-4", "max-sm:flex-col")}>
        <div>
          <FooterLogoLight className="dark:hidden" />
          <FooterLogoDark className="hidden dark:inline" />
        </div>
        <p className={clsx("text14Medium text-textTertiary", "max-sm:mt-2")}>
          @{new Date().getFullYear()} SubSquare. Powered by OpenSquare
        </p>
      </div>

      <div className={clsx("flex items-center gap-x-6", "max-sm:flex-col")}>
        <ul className={clsx("flex", "text14Medium", "max-sm:mt-2.5")}>
          {contactLinks.map((contact) => (
            <li
              key={contact.name}
              className="after:content-['·'] after:mx-2 after:text-textTertiary after:last:hidden"
            >
              <ExternalLink
                className="text-textSecondary hover:text-textPrimary"
                href={contact.link}
                externalIcon={false}
              >
                {contact.name}
              </ExternalLink>
            </li>
          ))}
        </ul>

        <div className={clsx("max-sm:mt-3 max-sm:mb-4")}>
          <ThemeToggleGroup />
        </div>
      </div>
    </div>
  );
}

function ThemeToggleGroup() {
  const [, setThemeMode, themeMode] = useThemeMode();

  const iconClassName = "w-4 h-4";

  const themeButtons = [
    {
      content: <ThemeSun className={iconClassName} />,
      themeMode: "light",
    },
    {
      content: <ThemeMoon className={iconClassName} />,
      themeMode: "dark",
    },
    {
      content: <ThemeSystem className={iconClassName} />,
      themeMode: "system",
    },
  ];

  return (
    <div className={clsx("p-1", "border rounded-lg border-neutral300")}>
      {themeButtons.map((button) => (
        <Tooltip
          key={button.themeMode}
          content={<span className="capitalize">{button.themeMode}</span>}
          sideOffset={5}
        >
          <button
            className={clsx(
              "p-1.5 rounded",
              "hover:bg-neutral200",
              "[&_path]:fill-textDisabled",
              button.themeMode === themeMode &&
                "bg-neutral200 [&_path]:fill-textSecondary",
              "text-textPrimary",
            )}
            onClick={() => setThemeMode(button.themeMode)}
          >
            {button.content}
          </button>
        </Tooltip>
      ))}
    </div>
  );
}
