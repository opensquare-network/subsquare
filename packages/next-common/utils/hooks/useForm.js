import { useState } from "react";

export default function useForm(initialState = {}, onSubmit, clearError) {
  const [formData, setFormData] = useState(initialState);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (clearError) clearError();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  const reset = () => {
    setFormData(initialState);
  };

  return { formData, handleInputChange, handleSubmit, reset };
}
