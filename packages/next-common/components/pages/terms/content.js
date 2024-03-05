import React from "react";
import termsMd from "./terms-of-service.md";
import { MarkdownPreviewer } from "@osn/previewer";
import {
  ProjectIconSubsquareDark,
  ProjectIconSubsquareLight,
} from "@osn/icons/subsquare";
import { StatementContent, LegalBreadcrumb, StatementTitle } from "../common";

const TermsContent = () => {
  return (
    <div className="mx-auto max-w-[856px] pb-6">
      <LegalBreadcrumb title="Terms of Service" />
      <StatementContent>
        <div className="mb-6">
          <ProjectIconSubsquareLight className="w-10 h-10 dark:hidden" />
          <ProjectIconSubsquareDark className="w-10 h-10 hidden dark:block" />
        </div>
        <StatementTitle>Terms of Service</StatementTitle>
        <MarkdownPreviewer content={termsMd} />
      </StatementContent>
    </div>
  );
};

export default TermsContent;
