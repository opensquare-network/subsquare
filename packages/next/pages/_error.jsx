import { ImgErrorDark, ImgErrorLight } from "@osn/icons/subsquare";
import ErrorLayout from "next-common/components/layout/errorLayout";
import { reportClientError } from "next-common/services/reportClientError";
import { CHAIN, IS_PRODUCTION } from "next-common/utils/constants";
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

function ErrorPage({ statusCode }) {
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
  const { result: user } =
    (await fetchProfile(
      req || {
        headers: {
          cookie: document?.cookie,
        },
      },
    )) || {};

  const statusCode = res?.statusCode || err?.statusCode || "";

  const isServerError = !!req;

  let errorData = {
    chain: CHAIN,
    url: req?.url || window?.location?.href,
    address: user?.address,
    code: statusCode,
    source: isServerError ? "server" : "client",
    userAgent: isServerError ? "" : navigator?.navigator?.userAgent,
    error: err.message,
    stack: err.stack,
  };
  IS_PRODUCTION && reportClientError(errorData);

  return {
    err,
    errorData,
    statusCode,
  };
};

export default ErrorPage;
