import { useEffect, useState } from "react";
import { layoutStyles } from "../../styles";
import { colorStyles } from "../../styles/colors";
import clsx from "clsx";
interface ToastProps {
  message: string;
  type: "success" | "error" | "warning";
  onClose: () => void;
}

export const Toast = ({ message, type, onClose }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    const visibilityTimer = setTimeout(() => {
      setIsVisible(false);
    }, 2500);

    const unmountTimer = setTimeout(() => {
      setShouldRender(false);
      onClose();
    }, 3000);

    return () => {
      clearTimeout(visibilityTimer);
      clearTimeout(unmountTimer);
    };
  }, [onClose]);

  if (!shouldRender) return null;

  const icon = {
    success: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    ),
    error: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    ),
    warning: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
  }[type];

  return (
    <div
      className={clsx(
        layoutStyles.toast.wrapper,
        layoutStyles.toast.animation,
        isVisible ? layoutStyles.toast.visible : layoutStyles.toast.hidden,
        colorStyles.toast[type]
      )}
    >
      {icon}
      <span className="text-white font-medium">{message}</span>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 500);
        }}
        className={layoutStyles.toast.closeButton}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

export default Toast;
