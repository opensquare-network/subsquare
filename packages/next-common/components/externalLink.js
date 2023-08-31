import clsx from "clsx";

export default function ExternalLink({
  href,
  children,
  title = "",
  className = "",
  externalIcon = true,
  ...props
}) {
  return (
    <a
      className={clsx(
        "text-sapphire500 text14Medium hover:!no-underline",
        className,
      )}
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

      {externalIcon && (
        <span className="text-textTertiary ml-1 relative -top-[1px]">↗</span>
      )}
    </a>
  );
}
