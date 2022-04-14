import React from "react";

export default function ExternalLink({ href, children, title ="" }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={title}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {children}
    </a>
  );
}
