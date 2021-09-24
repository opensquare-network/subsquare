import { useState } from "react";
import ZoomIn from "../../public/imgs/icons/zoom-in.svg";
import ZoomOut from "../../public/imgs/icons/zoom-out.svg";
import styled from "styled-components";
import Image from "next/image";

const ImgWrapper = styled.div`
  position: relative;
  user-select: none;
  -webkit-user-select: none;

  :hover {
    svg {
      visibility: visible;
    }
  }

  svg {
    visibility: hidden;
    position: absolute;
    top: 0;
    left: 0;

    :hover {
      rect {
        fill-opacity: 0.4;
      }
    }
  }

  svg.out {
    left: 25px;
  }
`;

const ImgRender = ({ md, setContent }) => {
  return (img) => {
    const hasUserWidth = img.src.includes("#/w");
    let userSetWidth = 0;
    const onImageLoad = ({ target: img }) => {
      if (!hasUserWidth) {
        setWidth(img.offsetWidth);
        const imgStringBefore = `![${img.alt}](${img.src})`;
        const imgStringNew = `![${img.alt}](${img.src}#/w${img.offsetWidth}/)`;
        setContent(md.replace(imgStringBefore, imgStringNew));
      }
    };
    if (hasUserWidth) {
      const hash = img.src.split("#")[1];
      userSetWidth = Number(hash.replace(/[^0-9]/gi, "")); //extract value from #/w:number
      if (isNaN(userSetWidth) || userSetWidth < 0 || userSetWidth > 800) {
        userSetWidth = 0;
      }
    }
    const [width, setWidth] = useState(userSetWidth);
    const zoom = (diff) => {
      return () => {
        if (width + diff < 100 || width + diff > 800) {
          return;
        }
        const widthBefore = width;
        const contentBefore = md;
        const imgStringBefore = `![${img.alt}](${img.src})`;
        let imgStringNew;
        setWidth(widthBefore + diff);
        if (hasUserWidth) {
          imgStringNew = imgStringBefore.replace(
            `#/w${widthBefore}`,
            `#/w${widthBefore + diff}`
          );
        } else {
          imgStringNew = `![${img.alt}](${img.src}#/w${widthBefore + diff}/)`;
        }
        setContent(contentBefore.replace(imgStringBefore, imgStringNew));
      };
    };
    return (
      <ImgWrapper>
        <Image alt="" onLoad={onImageLoad} width={width ? width : "auto"} {...img} />
        <ZoomIn className="in" onClick={zoom(+100)} />
        <ZoomOut className="out" onClick={zoom(-100)} />
      </ImgWrapper>
    );
  };
};

export default ImgRender;
