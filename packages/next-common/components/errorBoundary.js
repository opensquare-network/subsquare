import React from "react";
import {
  ImgErrorDark,
  ImgErrorLight,
  SystemWarning,
} from "@osn/icons/subsquare";
import PartialBoundaryLayout from "next-common/components/layout/partialBoundaryLayout";
import ErrorLayout from "next-common/components/layout/errorLayout";
import { reportClientError } from "next-common/services/reportClientError";
import { CHAIN } from "next-common/utils/constants";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    const errorData = {
      chain: CHAIN,
      url: typeof window !== "undefined" ? window.location.href : "",
      address: this.props.user?.address,
      error: error.message,
      source: "client",
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    };

    reportClientError(errorData);
  }

  resetErrorState = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    const { isPartialComponent = false } = this.props || {};

    if (this.state.hasError) {
      return !isPartialComponent ? (
        <ErrorLayout
          icon={
            <>
              <ImgErrorLight className="dark:hidden" />
              <ImgErrorDark className="hidden dark:block" />
            </>
          }
          title="Oops! Something Went Wrong"
          description="If the problem persists feel free to contact us"
          retry={this.resetErrorState}
        />
      ) : (
        <PartialBoundaryLayout
          icon={<SystemWarning />}
          title="Oops! Something Went Wrong"
          description="If the problem persists feel free to contact us"
          retry={this.resetErrorState}
        />
      );
    }

    return this.props.children;
  }
}

export default React.memo(ErrorBoundary);
