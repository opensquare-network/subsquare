import React from "react";
import NextHead from "next-common/components/nextHead";
import BaseLayout from "next-common/components/layout/baseLayout";
import PrivacyContent from "./content";

const Privacy = () => {
  return (
    <BaseLayout>
      <NextHead title="Privacy Policy" desc="Privacy Policy" />
      <PrivacyContent />
    </BaseLayout>
  );
};

export default Privacy;
