import { buttonStyles } from "../../../styles";

export const DisconnectButton = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick} className={buttonStyles.variants.disconnect}>
    Disconnect
  </button>
);
