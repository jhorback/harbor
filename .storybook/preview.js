export const parameters = {
  options: {
    storySort: {
      order: ["Harbor Design", "Foundation", "Layout", ["Avatar Doc", "Avatar Button"], "Common"],
      // order: ['Foundation', 'Layout', ['Home', 'Login', 'Admin'], 'Components'],
    },
  },
  themes: {
  default: 'Dark',
  list: [
    { name: 'Light', class: 'light-theme', color: "#FFFFFF" },
    { name: 'Dark', class: 'dark-theme', color: "#777777" }
  ],
  onChange: (theme) => {
    console.log("Changed theme to " + theme.name);
  },
  target: "html",
  clearable: false
  },
  actions: { argTypesRegex: "^on[A-Z].*" },
  backgrounds: { disable: true },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    }
  },
}