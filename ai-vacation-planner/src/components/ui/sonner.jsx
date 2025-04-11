import { toast, Toaster as Sonner } from "sonner";
import { useTheme } from "next-themes";

const Toaster = ({ textColor, bgColor, ...props }) => {
  const { theme = "system" } = useTheme();

  return <Sonner theme={theme} className="toaster group" {...props} />;
};

// Function to trigger toast with styles
const showToast = (textColor, bgColor, message) => {
  toast(message, {
    style: {
      backgroundColor: bgColor,
      color: textColor,
    },
  });
};

export { Toaster, showToast };
