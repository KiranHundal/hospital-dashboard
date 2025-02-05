export interface Styles {
    button: ButtonStyles;
    table: TableStyles;
    comparison: ComparisonStyles;
    splitScreen: SplitScreenStyles;
    patient: PatientStyles;
    dashboard: DashboardStyles;
    vital: VitalStyles;
    status: StatusStyles;
    stat: StatStyles;
    filter: FilterStyles;
    expandable: ExpandableStyles;
}

export interface ButtonStyles {
    base: string;
    variants: {
      icon: string;
      connect: string;
      disconnect: string;
      loading: string;
    };
    states: {
      active: string;
      inactive: string;
    };
    icon: {
      base: string;
      spinning: string;
    };
    pagination: {
      base: string;
      primary: string;
      icon: string;
      hover: string;
      disabled: string;
    };
    search: {
      base: string;
      primary: string;
    };
    patient: {
        action: string;
        delete: string;
      };
}
export interface TableStyles {
    container: {
      wrapper: string;
      inner: string;
      responsive: string;
    };
    header: {
      cell: string;
      content: string;
      sortable: string;
    };
    body: {
      row: {
        base: string;
        expanded: string;
        updated: string;
        critical: string;
      };
      cell: {
        base: string;
        action: string;
      };
    };
    expanded: {
      section: string;
      title: string;
      content: string;
      grid: string;
    };
    content: {
        wrapper: string;
        background: {
          light: string;
          dark: string;
        };
      };
      table: {
        base: string;
        divider: string;
      };
    }

  export interface ComparisonStyles {
    container: string;
    header: string;
    content: {
      row: string;
      label: string;
      value: string;
      comparison: string;
    };
    alert: {
      container: string;
      icon: string;
      text: string;
    };
    notes: {
      container: string;
      input: string;
      list: string;
      item: string;
      timestamp: string;
      actions: string;
    };
  }
export interface SplitScreenStyles {
    container: {
      base: string;
      header: string;
      controlsWrapper: string;
      contentWrapper: string;
      panel: {
        base: string;
        left: string;
        right: string;
        content: string;
      };
      notesSection: string;
      notesContent: string;
    };
    button: {
      control: string;
      icon: {
        default: string;
        active: string;
      };
    };
    select: {
      base: string;
      option: string;
      control: string;
    };
    text: {
      title: string;
      heading: string;
      content: string;
    };
  }
  export interface PatientStyles {
    notes: {
      container: string;
      title: string;
      textarea: string;
    };
    info: {
      section: string;
      container: string;
      label: string;
      value: string;
    };
  }
  export interface DashboardStyles {
    container: {
      base: string;
      content: string;
      header: {
        wrapper: string;
        container: string;
        content: string;
      };
      main: {
        container: string;
        section: string;
      };
    };
  }

  export interface VitalStyles {
    container: string;
    sign: {
      base: string;
      normal: string;
      abnormal: string;
      label: string;
    };
    section: {
      container: string;
      grid: string;
    };
  }


export interface StatusStyles {
    container: {
      base: string;
      title: string;
      list: string;
    };
    item: {
      base: string;
      icon: string;
    };
    icon: {
      base: string;
      yellow: string;
      purple: string;
      red: string;
    };
  }

  export interface StatStyles {
    card: {
      base: string;
      container: string;
      content: {
        wrapper: string;
        header: string;
        value: string;
        description: string;
      };
      borders: {
        default: string;
        highlight: string;
        trend: {
          up: string;
          down: string;
        };
      };
      backgrounds: {
        default: string;
        highlight: string;
      };
    };
    critical: {
      container: string;
      header: string;
      value: string;
      details: {
        container: string;
        item: string;
        icon: {
          red: string;
          blue: string;
          pink: string;
        };
      };
    };
  }

  export interface FilterStyles {
    panel: {
      container: string;
      header: {
        wrapper: string;
        title: string;
        closeButton: string;
      };
      content: string;
      section: {
        wrapper: string;
        label: string;
        input: string;
        checkbox: string;
      };
      button: string;
    };
  }


  export interface ExpandableStyles {
    card: {
      container: string;
      content: {
        wrapper: string;
        inner: string;
        grid: string;
        timestamp: string;
      };
      header: {
        wrapper: string;
        title: string;
        badge: string;
        controls: string;
        expandButton: string;
      };
      section: {
        wrapper: string;
        title: string;
        content: string;
      };
      trends: {
        container: string;
        title: string;
        content: string;
      };
    };
  }


  export const buttonStyles: ButtonStyles = {
    base: "inline-flex items-center",
    variants: {
      icon: "p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800",
      connect: "px-3 py-1.5 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800",
      disconnect: "px-3 py-1.5 text-sm font-medium rounded-md text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50",
      loading: "px-3 py-1.5 text-sm font-medium rounded-md bg-gray-100 text-gray-400 dark:bg-gray-800"
    },
    states: {
      active: "bg-white dark:bg-gray-700 shadow-sm",
      inactive: "hover:bg-gray-200 dark:hover:bg-gray-600"
    },
    icon: {
      base: "w-4 h-4 text-gray-600 dark:text-gray-400",
      spinning: "animate-spin"
    },
    pagination: {
      base: "relative inline-flex items-center text-sm font-medium rounded-md",
      primary: "px-4 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600",
      icon: "px-2 py-2 text-gray-400 dark:text-gray-500 border border-gray-300 dark:border-gray-600",
      hover: "hover:bg-gray-50 dark:hover:bg-gray-700",
      disabled: "disabled:opacity-50 disabled:cursor-not-allowed"
    },
    search: {
      base: "flex items-center space-x-2 px-4 py-2 rounded",
      primary: "bg-blue-500 text-white hover:bg-blue-600"
    },
    patient: {
      action: "text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 flex items-center justify-end gap-1",
      delete: "text-sm text-red-500 hover:text-red-600"
    }
} as const;

export const styles: Styles = {
    button: buttonStyles,
    table: {
      container: {
        wrapper: "w-full overflow-x-auto",
        inner: "min-w-[800px]",
        responsive: "overflow-hidden rounded-lg transition-colors duration-300"
      },
      header: {
        cell: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
        content: "flex items-center",
        sortable: "cursor-pointer"
      },
      body: {
        row: {
          base: "transition-colors duration-500",
          expanded: "bg-gray-50 dark:bg-slate-800/50",
          updated: "bg-blue-50 dark:bg-blue-900/20",
          critical: "bg-red-50 dark:bg-red-900/20"
        },
        cell: {
          base: "px-6 py-4 whitespace-nowrap text-sm",
          action: "px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
        }
      },
      expanded: {
        section: "px-6 py-4",
        title: "text-sm font-medium mb-2",
        content: "text-sm",
        grid: "grid grid-cols-3 gap-6"
      },
      content: {
        wrapper: "overflow-hidden rounded-lg transition-colors duration-300",
        background: {
          light: "bg-white",
          dark: "bg-slate-900"
        }
      },
      table: {
        base: "min-w-full",
        divider: "divide-y divide-gray-200 dark:divide-gray-700"
      }
    },
    comparison: {
      container: "bg-white dark:bg-gray-800 rounded-lg shadow p-4",
      header: "text-lg font-semibold mb-4",
      content: {
        row: "flex justify-between items-center",
        label: "text-gray-600 dark:text-gray-300",
        value: "flex items-center",
        comparison: "ml-4 text-sm text-gray-500"
      },
      alert: {
        container: "mt-4 p-2 bg-yellow-50 dark:bg-yellow-900 rounded-lg flex items-center",
        icon: "text-yellow-500 mr-2",
        text: "text-sm text-yellow-700 dark:text-yellow-300"
      },
      notes: {
        container: "space-y-3",
        input: "flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none",
        list: "space-y-3",
        item: "p-3 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600",
        timestamp: "flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1",
        actions: "flex justify-end mt-2"
      }
    },
    splitScreen: {
        container: {
          base: "flex flex-col h-[calc(100vh-12rem)]",
          header: "bg-white dark:bg-gray-800 p-4 flex items-center justify-between border-b",
          controlsWrapper: "flex items-center space-x-4",
          contentWrapper: "flex flex-1 overflow-hidden",
          panel: {
            base: "overflow-y-auto transition-all duration-300",
            left: "border-r dark:border-gray-700",
            right: "",
            content: "p-4"
          },
          notesSection: "h-72 border-t dark:border-gray-700 bg-white dark:bg-gray-800",
          notesContent: "h-full overflow-y-auto p-4"
        },
        button: {
          control: "p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700",
          icon: {
            default: "text-gray-500",
            active: "text-blue-500"
          }
        },
        select: {
          base: "w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white",
          option: "bg-white dark:bg-gray-700 dark:text-white",
          control: "p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        },
        text: {
          title: "text-xl font-bold text-gray-900 dark:text-white",
          heading: "text-lg font-semibold text-gray-900 dark:text-white",
          content: "space-y-4"
        },

      },
      patient: {
        notes: {
          container: "w-full",
          title: "text-sm font-medium text-gray-900 dark:text-white mb-2",
          textarea: "w-full h-24 px-3 py-2 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        },
        info: {
          section: "mt-2 grid grid-cols-3 gap-4",
          container: "text-sm",
          label: "text-gray-500 dark:text-gray-400",
          value: "ml-2 font-medium dark:text-white"
        }
      },
      dashboard: {
        container: {
          base: "min-h-screen",
          content: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
          header: {
            wrapper: "sticky top-0 z-40 shadow-sm backdrop-blur",
            container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
            content: "flex justify-between items-center py-4"
          },
          main: {
            container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6",
            section: "mt-6"
          }
        }
      },
      vital: {
        container: "mt-3 grid grid-cols-3 gap-4",
        sign: {
          base: "text-sm",
          normal: "text-gray-600 dark:text-gray-300",
          abnormal: "text-red-600 dark:text-red-400",
          label: "font-medium"
        },
        section: {
            container: "mt-3",
            grid: "grid grid-cols-3 gap-4"
          }
      },
      status: {
        container: {
          base: "mt-4 flex items-center space-x-6",
          title: "text-sm font-medium text-gray-900 dark:text-white mb-2",
          list: "space-y-2"
        },
        item: {
          base: "flex items-center text-sm",
          icon: "w-4 h-4 mr-2"
        },
        icon: {
          base: "w-5 h-5",
          yellow: "text-yellow-500 dark:text-yellow-400",
          purple: "text-purple-500 dark:text-purple-400",
          red: "text-red-500 dark:text-red-400"
        }
      },
      stat: {
        card: {
          base: "h-40 p-6 rounded-lg shadow-sm transition-all",
          container: "flex h-full flex-col justify-between",
          content: {
            wrapper: "flex justify-between items-start",
            header: "text-sm font-medium text-gray-600 dark:text-gray-300 truncate",
            value: "mt-2 text-2xl font-bold",
            description: "mt-auto text-sm text-gray-500 dark:text-gray-400"
          },
          borders: {
            default: "border border-gray-200 dark:border-gray-700",
            highlight: "border-l-4 border-red-500 dark:border-red-400",
            trend: {
              up: "border-r-4 border-amber-500 dark:border-amber-400",
              down: "border-r-4 border-emerald-500 dark:border-emerald-400"
            }
          },
          backgrounds: {
            default: "bg-white dark:bg-gray-800",
            highlight: "animate-pulse bg-red-50 dark:bg-red-900/20"
          }
        },
        critical: {
          container: "h-40 p-6 rounded-lg shadow-sm transition-all border-l-4 border-red-500 dark:border-red-400",
          header: "text-sm font-medium text-gray-600 dark:text-gray-300",
          value: "mt-2 text-2xl font-bold text-red-600 dark:text-red-400",
          details: {
            container: "space-y-3",
            item: "flex items-center gap-2 text-sm",
            icon: {
              red: "text-red-500 dark:text-red-400",
              blue: "text-blue-500 dark:text-blue-400",
              pink: "text-pink-500 dark:text-pink-400"
            }
          }
        }
      },
      filter: {
        panel: {
          container: "fixed top-0 right-0 w-96 h-full bg-white dark:bg-gray-800 shadow-lg z-50 p-6 transition-transform transform translate-x-0 border-l dark:border-gray-700",
          header: {
            wrapper: "flex justify-between items-center mb-6 border-b pb-4 dark:border-gray-700",
            title: "text-lg font-semibold text-gray-800 dark:text-white",
            closeButton: "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
          },
          content: "space-y-6",
          section: {
            wrapper: "space-y-2",
            label: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",
            input: "w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white",
            checkbox: "rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500"
          },
          button: "w-full bg-blue-500 text-white font-semibold p-3 rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition"
        }
      },
      expandable: {
        card: {
          container: "relative rounded-lg shadow-sm bg-white dark:bg-gray-800",
          content: {
            wrapper: "overflow-hidden transition-all duration-300",
            inner: "p-4",
            grid: "grid grid-cols-2 gap-4",
            timestamp: "mt-1 text-xs text-gray-400 dark:text-gray-500"
          },
          header: {
            wrapper: "flex justify-between items-start",
            title: "text-lg font-semibold dark:text-white",
            badge: "px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
            controls: "flex items-center space-x-2",
            expandButton: "p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          },
          section: {
            wrapper: "p-4 border-t dark:border-gray-700",
            title: "text-sm font-medium text-gray-900 dark:text-white mb-2",
            content: "text-sm text-gray-500 dark:text-gray-400"
          },
          trends: {
            container: "mt-4",
            title: "text-sm font-medium text-gray-900 dark:text-white mb-2",
            content: "text-sm text-gray-500 dark:text-gray-400"
          }
        }
      }

    } as const;
