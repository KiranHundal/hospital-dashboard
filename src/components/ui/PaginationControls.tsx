import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonStyles } from "../../styles";
import clsx from "clsx";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  goToNextPage,
  goToPreviousPage,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className={clsx(
            buttonStyles.pagination.base,
            buttonStyles.pagination.primary,
            buttonStyles.pagination.hover,
            buttonStyles.pagination.disabled
          )}
        >
          Previous
        </button>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className={clsx(
            buttonStyles.pagination.base,
            buttonStyles.pagination.primary,
            buttonStyles.pagination.hover,
            buttonStyles.pagination.disabled,
            "ml-3"
          )}
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Showing page <span className="font-medium">{currentPage}</span> of{" "}
            <span className="font-medium">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-l-md px-2 py-2
                text-gray-400 dark:text-gray-500
                hover:bg-gray-50 dark:hover:bg-gray-700
                disabled:opacity-50 disabled:cursor-not-allowed
                border border-gray-300 dark:border-gray-600"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center rounded-r-md px-2 py-2
                text-gray-400 dark:text-gray-500
                hover:bg-gray-50 dark:hover:bg-gray-700
                disabled:opacity-50 disabled:cursor-not-allowed
                border border-gray-300 dark:border-gray-600"
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};
