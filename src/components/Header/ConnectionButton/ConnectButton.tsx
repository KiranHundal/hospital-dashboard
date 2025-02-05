import clsx from "clsx";
import { buttonStyles } from "../../../styles";

interface ConnectButtonProps {
  onClick: () => void;
}

export const ConnectButton = ({ onClick }: ConnectButtonProps) => (
  <button
    onClick={onClick}
    className={clsx(buttonStyles.base, buttonStyles.variants.connect)}
  >
    Connect
  </button>
);
