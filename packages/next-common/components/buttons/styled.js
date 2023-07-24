import styled, { css } from "styled-components";

const CommonButtonWrapper = styled.button`
  padding: 0 12px;
  height: 38px;
  border-radius: 8px;
  cursor: pointer;
  text-align: center;
  display: inline-block;
  box-sizing: border-box;
  font-weight: 500;
  font-size: 14px;
  ${(p) =>
    p.isFill &&
    css`
      width: 100%;
    `}

  ${(p) =>
    p.isLoading &&
    css`
      pointer-events: none;
    `}

  ${(p) =>
    p.small &&
    css`
      height: 26px;
      font-size: 12px;
      border-radius: 4px;
    `}

  ${(p) =>
    p.disabled &&
    css`
      cursor: not-allowed;
    `}
`;

function CommonButton({
  children,
  className,
  icon,
  isLoading,
  disabled,
  small,
  ...props
}) {
  return (
    <CommonButtonWrapper
      className={className}
      small={small}
      isLoading={isLoading}
      disabled={disabled}
      {...props}
    >
      <span className="w-full h-full inline-flex items-center justify-center gap-x-1.5">
        {icon && !isLoading && icon}
        {children}
      </span>
    </CommonButtonWrapper>
  );
}

// These kinds of button has a colored background, and the text color is contrast.
export const BackgroundButton = styled(CommonButton)`
  color: var(--textPrimaryContrast) !important;
`;

export const DisabledButton = styled(CommonButton)`
  cursor: not-allowed;
  background-color: var(--neutral500);
  color: var(--textPrimaryContrast);
`;

export default CommonButton;
