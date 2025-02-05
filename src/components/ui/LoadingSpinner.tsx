import { layoutStyles } from "../../styles";
import { colorStyles } from "../../styles/colors";
import clsx from "clsx";

export const LoadingSpinner = () => (
  <div className={layoutStyles.container.center}>
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
      <p className={clsx(colorStyles.text.muted, "mt-4")}>
        Loading patient data...
      </p>
    </div>
  </div>
);
