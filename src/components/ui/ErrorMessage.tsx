import { layoutStyles } from "../../styles";
import { colorStyles } from "../../styles/colors";
import clsx from "clsx";
interface ErrorMessageProps {
  message: string;
}
export const ErrorMessage = ({ message }: ErrorMessageProps) => (
  <div className={layoutStyles.container.center}>
    <div className="text-center">
      <p className={clsx(colorStyles.text.error, "text-xl mb-2")}>Error</p>
      <p className={colorStyles.text.error}>{message}</p>
    </div>
  </div>
);
