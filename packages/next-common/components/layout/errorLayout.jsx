import {
  LinkElement,
  LinkEmail,
  LinkTelegram,
  LinkGithub,
} from "@osn/icons/subsquare";
import ThemeModeProvider from "next-common/context/theme";
import SecondaryButton from "next-common/lib/button/secondary";
import Link from "next/link";
import ExternalLink from "../externalLink";
import { memo } from "react";
import { cn } from "next-common/utils";

const contactLinks = [
  {
    name: "Github",
    link: "https://github.com/opensquare-network/subsquare/issues",
    icon: LinkGithub,
  },
  {
    name: "Telegram",
    link: "https://t.me/opensquare",
    icon: LinkTelegram,
  },
  {
    name: "Element",
    link: "https://app.element.io/#/room/#opensquare:matrix.org",
    icon: LinkElement,
  },
  {
    name: "Email",
    link: "mailto:yongfeng@opensquare.network",
    icon: LinkEmail,
  },
];

export const ContactWithUs = memo(function ContactWithUs({ className = "" }) {
  return (
    <div className={cn("flex", "items-center", "gap-x-2", className)}>
      {contactLinks.map((contact) => (
        <ExternalLink
          externalIcon={false}
          href={contact.link}
          key={contact.name}
        >
          <contact.icon className="w-5 h-5 text-textTertiary" />
        </ExternalLink>
      ))}
    </div>
  );
});

export default function ErrorLayout({ icon, title, description }) {
  return (
    <ThemeModeProvider defaultThemeMode="system">
      <div className="h-screen flex flex-col items-center justify-center gap-y-6 text-textPrimary text14Medium">
        {icon}

        <div className="flex flex-col items-center">
          <div className="text20Bold">{title}</div>
          <div className="mt-2 text-textTertiary">{description}</div>
        </div>

        <Link href="/">
          <SecondaryButton>Home Page</SecondaryButton>
        </Link>

        <div className="flex flex-col items-center gap-y-2">
          <div className="text-textSecondary">Contact Support</div>
          <ContactWithUs />
        </div>
      </div>
    </ThemeModeProvider>
  );
}
