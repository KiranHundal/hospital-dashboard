import { FiSearch, FiRefreshCcw, FiFilter } from "react-icons/fi";
import { buttonStyles, layoutStyles } from "../../styles";
import clsx from "clsx";

interface SearchAndFilterBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onSearch: () => void;
  onReset: () => void;
  onFilter: () => void;
  onResetSorting?: () => void;
}

export const SearchAndFilterBar = ({
  searchTerm,
  setSearchTerm,
  onSearch,
  onReset,
  onFilter,
}: SearchAndFilterBarProps) => (
  <div className={layoutStyles.container.searchBar}>
    <div className="relative w-64">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
        className={layoutStyles.input.search}
      />
      <div onClick={onSearch} className={layoutStyles.input.searchIcon}>
        <FiSearch className="w-5 h-5" />
      </div>
    </div>
    <div className="flex items-center space-x-2">
      <button
        onClick={onReset}
        className={clsx(buttonStyles.search.base, buttonStyles.search.primary)}
      >
        <FiRefreshCcw className="w-5 h-5" />
        <span>Reset</span>
      </button>
      <button
        onClick={onFilter}
        className={clsx(buttonStyles.search.base, buttonStyles.search.primary)}
      >
        <FiFilter className="w-5 h-5" />
        <span>Filter</span>
      </button>
    </div>
  </div>
);
