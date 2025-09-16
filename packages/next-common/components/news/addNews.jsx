import { PopupButtonWrapper } from "next-common/components/popup/wrapper";
import Popup from "../popup/wrapper/Popup";
import { useCallback, useState } from "react";
import { Fragment } from "react";
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

export default function AddNewsPopup() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ title: "", link: "" });
  const [errors, setErrors] = useState({});

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (formData.link && !isValidUrl(formData.link)) {
      newErrors.link = "Please enter a valid URL";
    }
    return Object.keys(newErrors).length === 0;
  }, [formData.link, formData.title]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      dispatch(newErrorToast("Please fix the form errors before submitting"));
      return;
    }

    setIsLoading(true);
    try {
      // todo api
    } catch (error) {
      dispatch(newErrorToast("Failed to add news item. Please try again."));
    } finally {
      setIsLoading(false);
    }
  }, [validateForm, dispatch]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <>
      <Button
        className="border border-neutral400"
        onClick={() => setOpen(true)}
      >
        Add News
      </Button>
      {open && (
        <Popup title="Add News" onClose={() => setOpen(false)}>
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title *
              </label>
              <textarea
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
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
              Add News
            </Button>
            <Button
              className="border border-neutral400"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </PopupButtonWrapper>
        </Popup>
      )}
    </>
  );
}
