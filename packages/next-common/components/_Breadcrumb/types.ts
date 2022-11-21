import React from "react";

type Item = {
  content: React.ReactNode;
};

export type BreadcrumbProps = {
  items: Item[];

  className?: string;

  /**
   * @default "/"
   */
  separator?: React.ReactNode;
};

export type BreadcrumbItemProps = {
  separator: BreadcrumbProps["separator"];
  children: React.ReactNode;
};
