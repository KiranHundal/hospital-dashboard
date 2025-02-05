import { layoutStyles } from "../../styles/layout";
import { BuildInfoProps } from "../../types/header";

export const BuildInfo = ({ version, buildTime }: BuildInfoProps) => (
  <div className={layoutStyles.buildInfo.wrapper}>
    <div className={layoutStyles.buildInfo.text}>
      Version {version} • Built {new Date(buildTime).toLocaleDateString()}
    </div>
  </div>
);
