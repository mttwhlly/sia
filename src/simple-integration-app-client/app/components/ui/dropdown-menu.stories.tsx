import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { DropdownMenu } from '~/components/ui/dropdown-menu';

const meta: Meta<typeof DropdownMenu> = {
  title: 'Components/Primitives/DropdownMenu',
  component: DropdownMenu,
} as Meta;

export default meta;

type Story = StoryObj<typeof DropdownMenu>

export const Default: Story = {
    args: {
        
    },
} 