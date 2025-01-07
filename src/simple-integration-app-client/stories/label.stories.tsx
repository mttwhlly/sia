import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Label } from '~/components/ui/label';

const meta: Meta<typeof Label> = {
  title: 'Components/Primitives/Label',
  component: Label,
} as Meta;

export default meta;

type Story = StoryObj<typeof Label>

export const Default: Story = {
    args: {
        
    },
} 