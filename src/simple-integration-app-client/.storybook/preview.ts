import type { Preview } from '@storybook/react'
import "../app/tailwind.css"
import { withA11y } from '@storybook/addon-a11y';

export const decorators = [withA11y];

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
