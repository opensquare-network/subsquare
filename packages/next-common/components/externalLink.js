import React from "react";

export default function ExternalLink({
  href,
  children,
  title = "",
  className = "",
  ...props
}) {
  return (
    <a
      className={className}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={title}
      {...props}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {children}
    </a>
  );
}
