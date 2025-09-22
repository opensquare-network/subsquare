import { useState } from "react";
import Input from "next-common/lib/input";
import { useDispatch } from "react-redux";
import Button from "next-common/lib/button";
import Popup from "next-common/components/popup/wrapper/Popup";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { PopupButtonWrapper } from "next-common/components/popup/wrapper";

const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};
export default function EditPopup({
  isLoading,
  onClose,
  onConfirm,
  data = {},
  title,
}) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(data);

  const validateForm = () => {
    if (!formData.content?.trim()) {
      return "Title is required";
    }
    if (formData.link && !isValidUrl(formData.link)) {
      return "Please enter a valid URL";
    }
  };

  const handleSubmit = async () => {
    const errorMessage = validateForm();
    if (errorMessage) {
      dispatch(newErrorToast(errorMessage));
      return;
    }

    onConfirm(formData);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Popup title={title} onClose={() => !isLoading && onClose(false)}>
      <div className="space-y-4 text-textPrimary">
        <div className="flex flex-col space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Title
          </label>
          <div>
            <Input
              maxLength={150}
              id="title"
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              placeholder="Enter news title "
            />
            <div className="text-end text12Normal text-xs text-textDisabled pt-0.5">
              {formData?.content?.length || 0} / 150
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="link" className="text-sm font-medium">
            Link (optional)
          </label>
          <Input
            id="link"
            type="url"
            value={formData.link}
            onChange={(e) => handleInputChange("link", e.target.value)}
            placeholder="https://..."
          />
        </div>
      </div>
      <PopupButtonWrapper className="space-x-2">
        <Button
          className="bg-theme500 text-textPrimaryContrast"
          onClick={handleSubmit}
          loading={isLoading}
        >
          Submit
        </Button>
        <Button
          className="border border-neutral400 text-textPrimary"
          onClick={() => onClose(false)}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </PopupButtonWrapper>
    </Popup>
  );
}
