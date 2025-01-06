import { SystemEye, SystemEyeSlash } from "@osn/icons/subsquare";
import { noop } from "lodash-es";
import ErrorText from "next-common/components/ErrorText";
import { cn } from "next-common/utils";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";

const Input = forwardRef(InputImpl);
export default Input;

/**
 * @param {InputProps} props
 */
function InputImpl(
  {
    className = "",
    prefix,
    suffix,
    pre,
    post,
    error,
    disabled,
    size,
    onFocus = noop,
    onBlur = noop,
    symbol,
    type = "text",
    ...props
  },
  ref,
) {
  const smallSize = size === "small";
  const isPassword = type === "password";

  const [focus, setFocus] = useState(false);
  const inputRef = useRef(null);
  useImperativeHandle(ref, () => inputRef.current);

  const [passwordVisible, setPasswordVisible] = useState(false);

  function handleOnFocus(event) {
    setFocus(true);
    onFocus(event);
  }
  function handleOnBlur(event) {
    setFocus(false);
    onBlur(event);
  }

  if (isPassword) {
    const Icon = passwordVisible ? SystemEye : SystemEyeSlash;

    suffix = (
      <button
        onClick={() => {
          setPasswordVisible(!passwordVisible);
        }}
      >
        <Icon className="w-4 h-4" />
      </button>
    );
  }

  return (
    <div>
      <div
        style={{
          "--input-gap-x": smallSize ? "0.75rem" : "1rem",
          "--input-gap-y": smallSize ? "0.375rem" : "0.625rem",
        }}
        className={cn(
          "flex",
          "overflow-hidden",
          "border border-neutral400 hover:border-neutral500",
          "rounded-lg",
          "bg-neutral100",
          "px-[var(--input-gap-x)]",
          smallSize ? "text12Medium" : "text14Medium",
          "text-textPrimary",
          (prefix || pre) && "pl-0",
          (suffix || post) && "pr-0",
          "cursor-text",
          error && "border-red500",
          focus && "border-neutral500",
          disabled &&
            "bg-neutral200 border-neutral400 hover:border-neutral400 cursor-default",
          className,
        )}
        onClick={() => {
          inputRef.current?.focus?.();
          setFocus(true);
        }}
      >
        {pre && <Addon className="border-r">{pre}</Addon>}

        {prefix && <Affix>{prefix}</Affix>}

        <input
          ref={inputRef}
          type={isPassword && passwordVisible ? "text" : type}
          autoComplete="off"
          disabled={disabled}
          className={cn(
            "flex grow",
            "font-normal",
            "bg-transparent",
            "border-none",
            "outline-none",
            "py-[var(--input-gap-y)]",
            "placeholder:text-textDisabled",
          )}
          {...props}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
        />

        {suffix && <Affix>{suffix}</Affix>}

        {post && <Addon className="border-l">{post}</Addon>}

        {symbol && <Addon className="border-l">{symbol}</Addon>}
      </div>

      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}

function Affix(props) {
  return (
    <div
      {...props}
      className={cn(
        "px-[calc(var(--input-gap-x)/2)]",
        "cursor-default flex items-center",
        props?.className,
      )}
    />
  );
}

function Addon(props) {
  return (
    <div
      {...props}
      className={cn(
        "flex items-center",
        "px-[var(--input-gap-x)]",
        "bg-neutral200",
        "border-neutral300",
        "cursor-default",
        props?.className,
      )}
      onClick={(e) => {
        e.stopPropagation();
        props?.onClick?.(e);
      }}
    />
  );
}
