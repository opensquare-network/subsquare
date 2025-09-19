import { PopupButtonWrapper } from "next-common/components/popup/wrapper";
import Popup from "next-common/components/popup/wrapper/Popup";
import { useState } from "react";
import Button from "next-common/lib/button";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import Input from "next-common/lib/input";

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
          <textarea
            id="title"
            value={formData.content}
            onChange={(e) => handleInputChange("content", e.target.value)}
            placeholder="Enter news title"
            className="border text14Medium border-neutral400 hover:border-neutral500 px-4 py-3 rounded focus:border-neutral500 outline-none bg-neutral100 placeholder:text-textDisabled"
            rows={3}
          />
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
