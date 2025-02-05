import { Loader } from "lucide-react";
import { buttonStyles } from "../../../styles";
import clsx from "clsx";

export const LoadingButton = () => (
  <button disabled className={buttonStyles.variants.loading}>
    <Loader
      className={clsx(
        buttonStyles.icon.base,
        buttonStyles.icon.spinning,
        "mr-2"
      )}
    />
    Connecting...
  </button>
);
