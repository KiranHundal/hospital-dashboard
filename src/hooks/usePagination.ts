import { useState } from 'react';

export const usePagination = <T,>(data: T[], rowsPerPage: number) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const resetPagination = () => setCurrentPage(1);

  return {
    paginatedData,
    currentPage,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    resetPagination,
  };
};
