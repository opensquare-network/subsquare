import { PopupButtonWrapper } from "next-common/components/popup/wrapper";
import Popup from "../popup/wrapper/Popup";
import { useCallback, useState } from "react";
import Button from "next-common/lib/button";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";

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
  const [errors, setErrors] = useState({});

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.content.trim()) {
      newErrors.title = "Title is required";
    }
    if (formData.link && !isValidUrl(formData.link)) {
      newErrors.link = "Please enter a valid URL";
    }
    return Object.keys(newErrors).length === 0;
  }, [formData.link, formData.content]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      dispatch(newErrorToast("Please fix the form errors before submitting"));
      return;
    }

    onConfirm(formData);
  }, [validateForm, onConfirm, formData, dispatch]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Popup title={title} onClose={() => onClose(false)}>
      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Title *
          </label>
          <textarea
            id="title"
            value={formData.content}
            onChange={(e) => handleInputChange("content", e.target.value)}
            placeholder="Enter news title"
            className="border border-neutral500 px-4 py-3 rounded"
            rows={3}
          />
          {errors.title && (
            <div className="text-red-500 text-xs">{errors.title}</div>
          )}
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="link" className="text-sm font-medium">
            Link (optional)
          </label>
          <input
            id="link"
            type="url"
            value={formData.link}
            onChange={(e) => handleInputChange("link", e.target.value)}
            placeholder="https://..."
            className="border border-neutral500 px-4 py-3 rounded"
          />
          {errors.link && (
            <div className="text-red-500 text-xs">{errors.link}</div>
          )}
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
          className="border border-neutral400"
          onClick={() => onClose(false)}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </PopupButtonWrapper>
    </Popup>
  );
}
