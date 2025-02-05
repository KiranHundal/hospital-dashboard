export const colorStyles = {
    toast: {
      success: "bg-green-500",
      error: "bg-red-500",
      warning: "bg-yellow-500"
    },
    text: {
        dark: "text-white dark:text-gray-100",
        error: "text-red-600",
        muted: "text-gray-600 dark:text-gray-300",
        primary: "text-gray-900 dark:text-white",
        secondary: "text-gray-500 dark:text-gray-400"
      },
      vitals: {
        low: "text-blue-600 dark:text-blue-400",
        high: "text-red-600 dark:text-red-400",
        normal: "text-green-600 dark:text-green-400",
        difference: {
          increase: "text-red-500 dark:text-red-400",
          decrease: "text-blue-500 dark:text-blue-400"
        }
      }
  } as const;
