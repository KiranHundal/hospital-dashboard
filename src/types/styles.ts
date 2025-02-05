import { layoutStyles } from "../styles/layout";
import { buttonStyles } from "../styles/shared";
import { typographyStyles } from "../styles/typography";
import { colorStyles } from "../styles/colors";

export interface StylesConfig {
    button: typeof buttonStyles;
    layout: typeof layoutStyles;
    typography: typeof typographyStyles;
    colors: typeof colorStyles
  }

  export type ButtonVariant = keyof typeof buttonStyles.variants;
  export type ButtonState = keyof typeof buttonStyles.states;
