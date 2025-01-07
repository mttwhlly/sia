import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from '~/components/ui/checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Primitives/Checkbox',
  component: Checkbox,
} as Meta;

export default meta;

type Story = StoryObj<typeof Checkbox>

export const Default: Story = {
    args: {
        
    },
} 