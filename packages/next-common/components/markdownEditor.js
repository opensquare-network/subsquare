import React, { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import ReactMde from "react-mde";
import Header from "../assets/imgs/md-icons/header.svg";
import Bold from "../assets/imgs/md-icons/bold.svg";
import Italic from "../assets/imgs/md-icons/italic.svg";
import Quote from "../assets/imgs/md-icons/quote.svg";
import OrderedList from "../assets/imgs/md-icons/ordered-list.svg";
import UnorderedList from "../assets/imgs/md-icons/unordered-list.svg";
import Link from "../assets/imgs/md-icons/link.svg";
import ImageIcon from "../assets/imgs/md-icons/image.svg";
import Code from "../assets/imgs/md-icons/code.svg";

const icons = new Map();
icons.set("header", <Header />);
icons.set("bold", <Bold />);
icons.set("italic", <Italic />);
icons.set("quote", <Quote />);
icons.set("ordered-list", <OrderedList />);
icons.set("unordered-list", <UnorderedList />);
icons.set("link", <Link />);
icons.set("image", <ImageIcon />);
icons.set("code", <Code />);

export const StyledTextArea = styled.div`
  ${(props) =>
    props &&
    !props.visible &&
    css`
      visibility: hidden;
      height: 0 !important;
    `}

  border: 1px solid #dddddd;
  border-radius: 0.25rem;

  &:hover,
  &.focused {
    border: 1px solid #b5b5b5;
  }

  & > section {
    margin-bottom: 8px;
  }

  textarea {
    resize: none;
    overflow-y: scroll;
    min-height: 100px;
    max-height: 300px;
    color: #000 !important;
    padding: 0.75rem 1rem !important;
    line-height: 1.375 !important;
    outline: none;
    font-size: 0.875rem;
  }

  .mde-tabs {
    display: none !important;
  }

  .react-mde {
    border: none;
    border-radius: 0.25rem;

    .grip {
      border-top: none;
      color: #e6e6e6;

      .icon {
        margin-bottom: 1rem;
      }
    }

    .mde-textarea-wrapper {
      border-top-style: solid;
      border-top-width: 1px;
      border-top-color: #e6e6e6;
    }

    .mde-header {
      display: flex;
      justify-content: space-between;
      background: white !important;
      border-bottom: none;
      @media screen and (max-width: 768px) {
        overflow-y: hidden;
        white-space: nowrap;
        margin-right: 90px;
        ::-webkit-scrollbar {
          display: none;
        }
      }

      .mde-tabs {
        margin: 0 0.5rem;

        button {
          font-weight: 500;
          padding: 0.8rem 1.6rem;
          color: #53595c;
          background: #f7f9fa;
          border-radius: 0.3em;
          border-bottom-color: #ebf0f5;
          margin-bottom: -1px;
          margin-top: 1rem;

          &.selected,
          &:focus {
            background: white;
            color: #2e2f30;
            border-style: solid;
            border-width: 1px;
            border-color: #ebf0f5;
            outline: none;
            border-bottom-color: white;
            margin-bottom: -1px;
            border-bottom-right-radius: 0;
            border-bottom-left-radius: 0;
            margin-top: 1rem;
          }

          &:hover {
            color: #2e2f30;
          }
        }
      }

      .mde-header-group {
        display: block;
        padding-right: 80px;

        .mde-header-item {
          display: inline-flex;
          align-items: center;

          button {
            color: #777b80;

            &:hover,
            &:active,
            &:focus {
              color: #2e2f30;
            }
          }

          .react-mde-dropdown {
            border-style: solid;
            border-width: 1px;
            border-color: #ebf0f5;
            border-radius: 0.5rem;

            .mde-header-item {
              button {
                p {
                  color: #777b80;
                }

                p:hover {
                  color: #2e2f30;
                }
              }
            }
          }
        }
      }
    }

    .mde-header + div {
      overflow: visible;
    }
  }

  .mde-text {
    border: 1px solid transparent !important;
    border-bottom-left-radius: 0.25rem;
    border-bottom-right-radius: 0.25rem;
  }

  ul.mde-suggestions {
    z-index: 999999;
    background-color: #ffffff;
    border: none;

    li {
      padding: 4px 16px 4px 16px;
      border: none;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 22px;
    }

    li[aria-selected="true"] {
      background-color: #f8f8f8;
      color: #34373c;
    }

    li:hover {
      background-color: #f8f8f8;
      color: #34373c;
    }
  }
`;

const MarkdownEditor = ({
  content,
  setContent,
  setEditorHeight,
  users = [],
  height = 100,
  visible = true,
  readOnly = false,
  isCreate = false,
}) => {
  const loadSuggestions = async (text) => {
    return new Promise((accept) => {
      const suggestions = (users || [])
        .map((user) => ({
          preview: user,
          value: `[@${user}](/member/${user})`,
        }))
        .filter((i) => i.preview.toLowerCase().includes(text.toLowerCase()));
      accept(suggestions);
    });
  };

  const [focused, setFocused] = useState(false);
  const [userResized, setUserResized] = useState(false);

  const ref = useRef();

  useEffect(() => {
    const textarea = ref?.current?.finalRefs?.textarea?.current;
    const body = document.getElementsByTagName("body")[0];
    if (textarea && !body.onmouseup) {
      body.onmouseup = function () {
        if (textarea?.style?.height !== `${height}px`) {
          setUserResized(true);
        }
        setEditorHeight(parseInt(textarea?.style?.height));
      };
    }
  }, [height, setEditorHeight]);

  return (
    <StyledTextArea
      className={focused ? "container focused" : "container"}
      visible={visible}
    >
      <ReactMde
        ref={ref}
        readOnly={readOnly}
        initialEditorHeight={height}
        value={content}
        onChange={(content) => {
          const textarea = ref?.current?.finalRefs?.textarea?.current;
          if (textarea && !userResized) {
            textarea.style.height = `${100}px`;
            if (isCreate) {
              textarea.style.height = `${200}px`;
            }
            textarea.style.height = textarea.scrollHeight + "px";
            setEditorHeight(textarea.scrollHeight);
          }
          setContent(content);
        }}
        loadSuggestions={loadSuggestions}
        toolbarCommands={[
          [
            "header",
            "bold",
            "italic",
            "quote",
            "ordered-list",
            "unordered-list",
            "link",
            "image",
            "code",
          ],
        ]}
        getIcon={(commandName) => {
          return icons.get(commandName);
        }}
        childProps={{
          textArea: {
            onFocus: () => {
              setFocused(true);
            },
            onBlur: () => {
              setFocused(false);
            },
          },
        }}
      />
    </StyledTextArea>
  );
};

export default MarkdownEditor;
