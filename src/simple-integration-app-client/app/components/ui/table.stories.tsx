import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Table } from '~/components/ui/table';

const meta: Meta<typeof Table> = {
  title: 'Components/Primitives/Table',
  component: Table,
} as Meta;

export default meta;

type Story = StoryObj<typeof Table>

export const Default: Story = {
    args: {
        
    },
} 