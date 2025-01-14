import { FiSearch, FiRefreshCcw, FiFilter } from "react-icons/fi";

interface SearchAndFilterBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onSearch: () => void;
  onReset: () => void;
  onFilter: () => void;
  onResetSorting: () => void;

}

export const SearchAndFilterBar = ({
  searchTerm,
  setSearchTerm,
  onSearch,
  onReset,
  onFilter,
  onResetSorting,

}: SearchAndFilterBarProps) => (
  <div className="flex justify-between items-center mb-4">
    <div className="relative w-64">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
        className="w-full border rounded px-4 py-2 pr-12"
      />
      <div
        onClick={onSearch}
        className="absolute right-0 top-0 h-full px-3 border-l flex items-center cursor-pointer text-gray-500 hover:text-gray-700"
      >
        <FiSearch className="w-5 h-5" />
      </div>
    </div>
    <div className="flex items-center space-x-2">
    <button
        onClick={() => {
          onReset();
          onResetSorting();
        }}
        className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        <FiRefreshCcw className="w-5 h-5" />
        <span>Reset</span>
      </button>
      <button
        onClick={onFilter}
        className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        <FiFilter className="w-5 h-5" />
        <span>Filter</span>
      </button>
    </div>
  </div>
);
