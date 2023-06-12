import clsx from "clsx";
import ExternalLink from "next-common/components/externalLink";
import { useThemeMode, useSetThemeMode } from "next-common/context/theme";

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
        "h-[72px] px-6 py-4 justify-between items-center",
        "border-t border-neutral300 bg-neutral100",
        "max-sm:flex-col",
      )}
    >
      <div className={clsx("flex items-center gap-x-4", "max-sm:flex-col")}>
        <div>logo</div>
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
              <ExternalLink className="text-textSecondary" href={contact.link}>
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
  const themeMode = useThemeMode();
  const setThemeMode = useSetThemeMode();

  const themeButtons = [
    {
      content: "L",
      themeMode: "light",
    },
    {
      content: "D",
      themeMode: "dark",
    },
    {
      content: "S",
      themeMode: "system",
    },
  ];

  return (
    <div className={clsx("p-1", "border rounded-lg border-neutral300")}>
      {themeButtons.map((button) => (
        <button
          key={button.themeMode}
          className={clsx(
            "w-7 h-7 rounded",
            "hover:bg-neutral200",
            button.themeMode === themeMode && "bg-neutral200",
            "text-textPrimary",
          )}
          onClick={() => setThemeMode(button.themeMode)}
        >
          {button.content}
        </button>
      ))}
    </div>
  );
}
