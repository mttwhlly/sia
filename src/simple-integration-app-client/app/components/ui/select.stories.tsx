import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Select } from '~/components/ui/select';

const meta: Meta<typeof Select> = {
  title: 'Components/Primitives/Select',
  component: Select,
} as Meta;

export default meta;

type Story = StoryObj<typeof Select>

export const Default: Story = {
    args: {
        
    },
} 