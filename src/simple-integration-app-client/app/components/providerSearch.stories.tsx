import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import ProviderSearch from './providerSearch';

const meta: Meta<typeof ProviderSearch> = {
  title: 'Components/Composites/Provider Search',
  component: ProviderSearch,
} as Meta;

export default meta;

type Story = StoryObj<typeof ProviderSearch>

export const Default: Story = {
    args: {
        
    },
} 