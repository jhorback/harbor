import { addons } from '@storybook/addons';
import { themes } from '@storybook/theming';
import harborTheme from './harborTheme';

addons.setConfig({
  theme: harborTheme,
});