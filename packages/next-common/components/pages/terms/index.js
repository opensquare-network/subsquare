import React from "react";
import NextHead from "next-common/components/nextHead";
import BaseLayout from "next-common/components/layout/baseLayout";
import TermsContent from "./content";

const Terms = () => {
  return (
    <BaseLayout>
      <NextHead title="Terms of Service" desc="Terms of Service" />
      <TermsContent />
    </BaseLayout>
  );
};

export default Terms;
