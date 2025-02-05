export const layoutStyles = {
    header: {
      wrapper: "w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800",
      container: "w-full max-w-screen-2xl mx-auto",
      content: "px-4 py-3",
      flex: "flex items-center justify-between",
      divider: "h-6 mx-2 border-l border-gray-200 dark:border-gray-700"
    },
    buildInfo: {
      wrapper: "px-4 py-1.5 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800",
      text: "text-xs text-gray-500 dark:text-gray-400"
    },
    viewControls: {
      container: "flex items-center bg-gray-100 dark:bg-gray-800 rounded-md p-1"
    },
    connectionStatus: {
      wrapper: "inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      dot: "w-1.5 h-1.5 mr-1.5 bg-green-500 rounded-full"
    },
    container: {
        center: "min-h-screen flex items-center justify-center bg-gray-50",
        searchBar: "flex justify-between items-center mb-4"
      },
      input: {
        search: "w-full border rounded px-4 py-2 pr-12",
        searchIcon: "absolute right-0 top-0 h-full px-3 border-l flex items-center cursor-pointer text-gray-500 hover:text-gray-700"
      },
      status: {
        dot: {
          base: "h-3 w-3 rounded-full",
          connected: "bg-green-500",
          disconnected: "bg-red-500"
        }
      },
      toast: {
        wrapper: "fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg",
        animation: "transform transition-all duration-500 ease-in-out",
        visible: "translate-y-0 opacity-100",
        hidden: "translate-y-2 opacity-0",
        closeButton: "ml-2 text-white/80 hover:text-white"
      }
  } as const;

