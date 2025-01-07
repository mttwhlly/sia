import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Button, ButtonProps } from '~/components/ui/button';

const meta: Meta<typeof Button> = {
  title: 'Components/Primitives/Button',
  component: Button,
} as Meta;

export default meta;

type Story = StoryObj<typeof Button>

export const Default: Story = {
    args: {
        children: 'Button',
    },
} 