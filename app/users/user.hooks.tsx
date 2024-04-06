import { useSearchParams, useNavigate } from "@remix-run/react";
import { useState } from "react";

import { SupportedLoginMode, isSupportedLoginMode } from "./login.route";

export const useLoginModeSwitcher = () => {
  const [searchParams] = useSearchParams();
  const searchMode = searchParams.get("mode") ?? "";
  const [mode, setMode] = useState<SupportedLoginMode>(
    isSupportedLoginMode(searchMode)
      ? (searchMode as SupportedLoginMode)
      : "username");


  const getNextMode = (): SupportedLoginMode => mode === 'email' ? 'username': 'email'

  const toggleMode = () => {
    const nextMode = getNextMode();
    setMode(nextMode);
    updateQueryParam("mode", nextMode);
  };

  const navigate = useNavigate();
  const updateQueryParam = (param: string, value: string) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set(param, value);
    navigate(`?${searchParams.toString()}`, { replace: true });
  };

  return {
    currentMode: mode,
    getNextMode,
    toggleMode,
  };
};
