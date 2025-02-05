import { layoutStyles } from '../../styles/layout';
import { typographyStyles } from '../../styles/typography';
import { HeaderTitleProps } from '../../types/header';

export const HeaderTitle = ({
  isConnected,
  formattedDate,
}: HeaderTitleProps) => (
  <div className="flex flex-col">
    <div className="flex items-center space-x-3">
      <h1 className={typographyStyles.title.base}>
        Hospital Patient Dashboard
      </h1>
      {isConnected && <ConnectionStatus />}
    </div>
    <span className={typographyStyles.subtitle.base}>
      {formattedDate}
    </span>
  </div>
);

export const ConnectionStatus = () => (
  <span className={layoutStyles.connectionStatus.wrapper}>
    <span className={layoutStyles.connectionStatus.dot}></span>
    Connected
  </span>
);
