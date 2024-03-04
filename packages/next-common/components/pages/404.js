import React from "react";
import { ThemeProvider } from "styled-components";
import { useRouter } from "next/router";
import NextHead from "next-common/components/nextHead";
import { useThemeSetting } from "../../context/theme";
import PageNotFound from "../pageNotFound";

const Page404 = function Custom404() {
  const router = useRouter();
  const theme = useThemeSetting();
  return (
    <ThemeProvider theme={theme}>
      <NextHead title={"Not Found"} desc={""} />
      <PageNotFound
        onBack={() => {
          router.push("/");
        }}
      />
    </ThemeProvider>
  );
};

export default Page404;
