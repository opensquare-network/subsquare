import {
  ImgErrorDark,
  ImgErrorLight,
  LinkElement,
  LinkEmail,
  LinkTelegram,
} from "@osn/icons/subsquare";
import ExternalLink from "next-common/components/externalLink";
import ThemeModeProvider from "next-common/context/theme";
import SecondaryButton from "next-common/lib/button/secondary";
import { reportClientError } from "next-common/services/reportClientError";
import { CHAIN } from "next-common/utils/constants";
import Link from "next/link";
import { useEffect } from "react";

const contactLinks = [
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

function getErrorReason(statusCode) {
  const reasons = {
    500: {
      title: "Internal Server Error",
      description:
        "The server encountered an error and could not complete your request",
    },
  };

  return (
    reasons[statusCode] || {
      title: "Application Error",
      description:
        "A client-side exception has occurred (see the browser console for more information)",
    }
  );
}
function ErrorPage({ statusCode, err, isServerError, reqUrl }) {
  useEffect(() => {
    if (err) {
      const errorData = {
        chain: CHAIN,
        url: typeof window !== "undefined" ? window.location.href : reqUrl,
        code: statusCode,
        error: err.message,
        source: isServerError ? "server" : "client",
        stack: err.stack,
      };

      reportClientError(errorData);
    }
  }, [err, isServerError, reqUrl, statusCode]);

  const { title, description } = getErrorReason(statusCode);

  return (
    <ThemeModeProvider defaultThemeMode="system">
      <div className="h-screen flex flex-col items-center justify-center gap-y-6 text-textPrimary text14Medium">
        <ImgErrorLight className="dark:hidden" />
        <ImgErrorDark className="hidden dark:block" />

        <div className="flex flex-col items-center">
          <div className="text20Bold">
            {statusCode} {title}
          </div>
          <div className="mt-2 text-textTertiary">{description}</div>
        </div>

        <Link href="/">
          <SecondaryButton>Go Back Home</SecondaryButton>
        </Link>

        <div className="flex flex-col items-center gap-y-2">
          <div className="text-textSecondary">Contact Support</div>
          <div className="flex items-center gap-x-2">
            {contactLinks.map((contact) => {
              return (
                <ExternalLink
                  externalIcon={false}
                  href={contact.link}
                  key={contact.name}
                >
                  <contact.icon className="w-5 h-5 text-textTertiary" />
                </ExternalLink>
              );
            })}
          </div>
        </div>
      </div>
    </ThemeModeProvider>
  );
}

ErrorPage.getInitialProps = async ({ req, res, err }) => {
  const statusCode = res?.statusCode || err?.statusCode;

  return {
    statusCode,
    err,
    isServerError: !!res,
    reqUrl: req?.url,
  };
};

export default ErrorPage;
