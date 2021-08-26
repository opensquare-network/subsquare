import styled from "styled-components";
import {useState} from "react";


const Shade = styled.div`
  z-index: 10;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6)
`

const Wrapper = styled.div`
  z-index: 11;
  position: fixed;
  top: 50%;
  left: 50%;
  margin-top: -200px;
  margin-left: -200px;
  padding-bottom: 16px;
  width: 400px;
  @media screen and (max-width: 600px) {
    width: 343px;
    margin-top: -50px;
    margin-left: -171px;
    border-radius: 6px;
  }
  background: #FFFFFF;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.04);
  border-radius: 8px;
`
const Title = styled.div`
  display: flex;
  padding: 24px 16px 12px 16px;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-weight: bold;

  svg {
    cursor: pointer;
  }
`


const FormWrapper = styled.div`
  padding: 0 16px 16px 16px;

  label {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 24px;
    font-size: 13px;
    border-radius: 4px;
    background-color: #fff;
    border: 1px solid #ddd;
    width: 96px;
  }
`

const TextArea = styled.textarea`
  font-family: Inter, serif;
  width: 100%;
  font-size: 14px;
  line-height: 14px;
  padding: 12px 16px;
  color: #34373C;
  resize: none;
  border: 1px solid #ddd;
  border-radius: 4px;

  &:focus, &:active {
    border: 1px solid #aaa;
    outline: none;
  }

  ::placeholder {
    color: #D7DEE8;
    opacity: 1;
  }
`

const SubmitButtonWrapper = styled.div`
  text-align: right;
`



const SubmitButton = styled.span`
  margin-right: 16px;
  display: inline-block;
  text-align: center;
  all: unset;
  width: 80px;
  line-height: 30px;
  font-weight: 500;
  font-size: 14px;
  color: #FFFFFF;
  background: #1E2134;
  border-radius: 4px;
  cursor: pointer;
`

const FileUpload = styled.input`
  visibility: hidden;
  position: absolute;
`

const Label = styled.div`
  padding: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  width: 368px;
  border-radius: 4px;
  background: #F8F8F8;

  span {
    font-size: 13px;
    line-height: 16px;
    text-align: center;
    color: #696D73;
  }
`


const Hint = styled.p`
  margin-top: 0.5rem;
  font-family: PingFang SC, sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 13px;
  line-height: 16px;
  color: #C8CBD0;
`

const FileName = styled.p`
  text-align: center;
  width: 80%;
  font-size: 14px;
  color: #34373C;

  span {
    white-space: nowrap;
    overflow: hidden;
    vertical-align: middle;
  }

  .ellipsis {
    display: inline-block;
    width: calc(30% + 1.2em);
    text-overflow: ellipsis;
  }

  .indent {
    display: inline-flex;
    width: calc(30% - 1.2em);
    justify-content: flex-end;
  }
`



function UploadImgModal({
                          showImgModal,
                          setShowImgModal,
                          insetQuillImgFunc: resolveInsertImgPromise,
                        }) {
  const [source, setSource] = useState("remote");
  const [link, setLink] = useState("");

  const onChange = (e) => {
    if (source === "remote") {
      setLink(e.target.value)
    }
  }


  const onInset = () => {
    try {
      if (source === "remote") {
        if (link) {
          resolveInsertImgPromise(link);
          setShowImgModal(false);
          setLink("");
        } else {
          // dispatch(
          //   addToast({
          //     type: "info",
          //     message: "请输入图片链接",
          //   })
          // )
        }
      }
    } catch (e) {
      setLink("");
    }
  }

  const onClose = () => {
    setShowImgModal(false);
  }
  if (!showImgModal) {
    return null;
  }

  return <Shade>
    <Wrapper>
      <Title>
        <span>Paste image URL</span>
        <svg onClick={onClose} width="16" height="16" viewBox="0 0 16 16" fill="none"
             xmlns="http://www.w3.org/2000/svg">
          <path
            d="M8.00007 7.0574L12.0072 3.05029L12.9498 3.99296L8.94273 8.00007L12.9498 12.0072L12.0072 12.9498L8.00007 8.94273L3.99296 12.9498L3.05029 12.0072L7.0574 8.00007L3.05029 3.99296L3.99296 3.05029L8.00007 7.0574Z"
            fill="#C8CBD0"/>
        </svg>
      </Title>

      <FormWrapper>

        <TextArea value={link} placeholder="Please fill available URL..." onChange={onChange}/>

      </FormWrapper>

      <SubmitButtonWrapper>
        <SubmitButton onClick={onInset}>Confirm</SubmitButton>
      </SubmitButtonWrapper>

    </Wrapper>
  </Shade>

}

export default UploadImgModal;
