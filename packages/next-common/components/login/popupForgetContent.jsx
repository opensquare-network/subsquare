import { useState } from "react";
import Input from "next-common/components/input";
import nextApi from "next-common/services/nextApi";
import ErrorText from "next-common/components/ErrorText";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import {
  FormInputsWrapper,
  FormWrapper,
  InfoWrapper,
  Label,
} from "next-common/components/login/styled";
import useForm from "../../utils/hooks/useForm";
import PrimaryButton from "../buttons/primaryButton";
import { PageTitleContainer } from "../styled/containers/titleContainer";
import { useDispatch } from "react-redux";
import GhostButton from "../buttons/ghostButton";
import { useLoginPopup } from "next-common/hooks/useLoginPopup";

export default function LoginPopupForgetContent() {
  const dispatch = useDispatch();
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState();
  const [loading, setLoading] = useState(false);
  const { closeLoginPopup } = useLoginPopup();

  const showErrorToast = (message) => dispatch(newErrorToast(message));

  const { formData, handleInputChange, handleSubmit } = useForm(
    {
      email: "",
    },
    async (formData) => {
      try {
        setLoading(true);
        const { result, error } = await nextApi.post("auth/forget", formData);
        if (result) {
          setSuccess(true);
        } else if (error) {
          setErrors(error);
        }
      } catch (e) {
        showErrorToast(e.message);
      } finally {
        setLoading(false);
      }
    },
    () => setErrors(null),
  );
  const { email } = formData;

  return (
    <div className="space-y-6">
      <PageTitleContainer>Reset Password</PageTitleContainer>
      {!success && (
        <>
          <FormWrapper onSubmit={handleSubmit}>
            <FormInputsWrapper>
              <Label>Email</Label>
              <Input
                placeholder="Please fill email"
                name="email"
                value={email}
                onChange={(e) => {
                  handleInputChange(e);
                }}
                error={errors?.data?.email}
              />
            </FormInputsWrapper>
            {errors?.message && !errors?.data && (
              <ErrorText>{errors?.message}</ErrorText>
            )}
            <PrimaryButton isFill type="submit" isLoading={loading}>
              Confirm
            </PrimaryButton>
          </FormWrapper>
        </>
      )}
      {success && (
        <>
          <InfoWrapper>
            The reset password link was sent to this email, if it exists in our
            database.
          </InfoWrapper>
          <GhostButton
            isFill
            onClick={() => {
              closeLoginPopup();
            }}
          >
            Close
          </GhostButton>
        </>
      )}
    </div>
  );
}
