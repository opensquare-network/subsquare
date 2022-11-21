import React from "react";

type Item = {
  path?: string;
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
  path?: Item["path"];
  children: React.ReactNode;
};
