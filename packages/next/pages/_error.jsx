import { ImgErrorDark, ImgErrorLight } from "@osn/icons/subsquare";
import ErrorLayout from "next-common/components/layout/errorLayout";
import { reportClientError } from "next-common/services/reportClientError";
import { CHAIN } from "next-common/utils/constants";
import { useEffect } from "react";
import fetchProfile from "next-common/lib/fetchProfile";

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

function ErrorPage({ statusCode, err, isServerError, reqUrl, user }) {
  useEffect(() => {
    if (err) {
      const errorData = {
        chain: CHAIN,
        url: typeof window !== "undefined" ? window.location.href : reqUrl,
        address: user?.address,
        code: statusCode,
        error: err.message,
        source: isServerError ? "server" : "client",
        stack: err.stack,
      };

      reportClientError(errorData);
    }
  }, [err, isServerError, reqUrl, statusCode, user]);

  const { title, description } = getErrorReason(statusCode);

  return (
    <ErrorLayout
      icon={
        <>
          <ImgErrorLight className="dark:hidden" />
          <ImgErrorDark className="hidden dark:block" />
        </>
      }
      title={`${statusCode} ${title}`}
      description={description}
    />
  );
}

ErrorPage.getInitialProps = async ({ req, res, err }) => {
  const { result: user } = await fetchProfile(req);
  const statusCode = res?.statusCode || err?.statusCode;

  return {
    statusCode,
    err,
    isServerError: !!res,
    reqUrl: req?.url,
    user,
  };
};

export default ErrorPage;
