import { create } from '@storybook/theming';
import brandImage from "../public/theme/harbor/harbor-storybook-logo.svg";

export default create({
  base: 'dark',
  //brandTitle: 'Harbor Components',
  // brandUrl: 'https://example.com',
  brandImage,
  // brandImage: 'https://place-hold.it/350x150',
  brandTarget: '_self',
});