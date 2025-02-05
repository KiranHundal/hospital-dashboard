import { GridIcon, ListIcon, Split } from "lucide-react";
import { layoutStyles } from "../../styles/layout";
import { ViewControlsProps } from "../../types/header";
import { ViewButton } from "./ViewButton";
import { buttonStyles } from "../../styles/shared";

export const ViewControls = ({
  layout,
  setLayout,
  isSplitScreen,
  toggleSplitScreen
}: ViewControlsProps) => (
  <div className={layoutStyles.viewControls.container}>
    <ViewButton
      onClick={() => setLayout("grid")}
      isActive={layout === "grid"}
      icon={<GridIcon className={buttonStyles.icon.base} />}
      label="Grid view"
    />
    <ViewButton
      onClick={() => setLayout("list")}
      isActive={layout === "list"}
      icon={<ListIcon className={buttonStyles.icon.base} />}
      label="List view"
    />
    <ViewButton
      onClick={toggleSplitScreen}
      isActive={isSplitScreen}
      icon={<Split className={buttonStyles.icon.base} />}
      label="Split screen"
    />
  </div>
);
