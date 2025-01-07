import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import ProviderTable from './providerSearch';

const meta: Meta<typeof ProviderTable> = {
  title: 'Components/Composites/Provider Results',
  component: ProviderTable,
} as Meta;

export default meta;

type Story = StoryObj<typeof ProviderTable>

export const Default: Story = {
    args: {
        
    },
} 