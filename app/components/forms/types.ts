import React from "react";

interface IFormInput {
  defaultValue: string | undefined;
  name: string;
}

export type FormTextProps = IFormInput & React.HTMLProps<HTMLInputElement> &{
  autofocus?: boolean;
  error?: string | null;
  label?: string;
  placeholder?: string;
  forwardRef?: React.RefObject<HTMLInputElement>;
  type?: string;
  step?: number;
  required?: boolean;
  tooltipMessage?: React.ReactNode;
}

export type FormTextAreaProps = IFormInput & React.HTMLProps<HTMLTextAreaElement> &{
  forwardRef: React.RefObject<HTMLTextAreaElement>;
  rows?: number;
}
