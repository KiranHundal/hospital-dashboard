import { GridIcon, ListIcon, Split } from "lucide-react";
import { ViewButton } from "./ViewButton";
import { ViewControlsProps } from "../../types/header";


   export const ViewControls = ({ layout, setLayout, isSplitScreen, toggleSplitScreen }: ViewControlsProps) => (
    <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-md p-1">
      <ViewButton
        onClick={() => setLayout("grid")}
        isActive={layout === "grid"}
        icon={<GridIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />}
        label="Grid view"
      />
      <ViewButton
        onClick={() => setLayout("list")}
        isActive={layout === "list"}
        icon={<ListIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />}
        label="List view"
      />
      <ViewButton
        onClick={toggleSplitScreen}
        isActive={isSplitScreen}
        icon={<Split className="w-4 h-4 text-gray-600 dark:text-gray-400" />}
        label="Split screen"
      />
    </div>
   );
