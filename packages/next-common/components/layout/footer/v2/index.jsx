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
        "h-[72px] px-6 justify-between items-center",
        "border-t border-neutral300 bg-neutral100",
      )}
    >
      <div className="flex items-center gap-x-4">
        <div>logo</div>
        <p className="text14Medium text-textTertiary">
          @{new Date().getFullYear()} SubSquare. Powered by OpenSquare
        </p>
      </div>

      <div className="flex items-center gap-x-6">
        <ul className={clsx("flex", "text14Medium")}>
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

        <div>
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
