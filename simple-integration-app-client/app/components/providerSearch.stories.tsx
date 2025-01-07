import React from 'react';
import { Meta, Story } from '@storybook/react';
import ProviderSearch from '~/components/providerSearch';

export default {
  title: 'Components/ProviderSearch',
  component: ProviderSearch,
} as Meta;

const Template: Story = (args) => <ProviderSearch {...args} />;

export const Default = Template.bind({});
Default.args = {
  // Add default props if any
};

export const WithQueryParams = Template.bind({});
WithQueryParams.args = {
  // Simulate query parameters
  searchParams: new URLSearchParams({
    firstName: 'John',
    lastName: 'Doe',
    city: 'New York',
    state: 'NY',
  }),
};