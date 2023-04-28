import { css } from "styled-components";

export const font_family = css`
  font-family: Inter, -apple-system, "Helvetica Neue", Helvetica, Arial,
    "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei",
    sans-serif;
`;

export const shadow_100 = css`
  box-shadow: 0 6px 7px rgba(30, 33, 52, 0.02),
    0 1.34018px 1.56354px rgba(30, 33, 52, 0.0119221),
    0 0.399006px 0.465507px rgba(30, 33, 52, 0.00807786);
`;

export const shadow_200 = css`
  box-shadow: 0 6px 22px rgba(30, 33, 52, 0.11),
    0 1.34018px 4.91399px rgba(30, 33, 52, 0.0655718),
    0 0.399006px 1.46302px rgba(30, 33, 52, 0.0444282);
`;

export const shadow_200_right = css`
  box-shadow: 6px 0 22px rgba(30, 33, 52, 0.11),
    1.34px 0 4.91399px rgba(30, 33, 52, 0.0655718),
    0.4px 0 1.46302px rgba(30, 33, 52, 0.0444282);
`;

export const p_20_bold = css`
  ${font_family};
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
`;

export const p_16_bold = css`
  ${font_family};
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
`;

export const p_14_bold = css`
  ${font_family};
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 20px;
`;

export const p_14_medium = css`
  ${font_family};
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
`;

export const p_14_normal = css`
  ${font_family};
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
`;

export const p_12_bold = css`
  ${font_family};
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 12px;
`;

export const p_12_medium = css`
  ${font_family};
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
`;

export const p_12_normal = css`
  ${font_family};
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16.8px;
`;

export const no_scroll_bar = css`
  -ms-overflow-style: none;
  scrollbar-width: none;

  ::-webkit-scrollbar {
    display: none;
  }
`;

export const pretty_scroll_bar = css`
  ::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.grey400Border};
    border-radius: 4px;
  }
`;
