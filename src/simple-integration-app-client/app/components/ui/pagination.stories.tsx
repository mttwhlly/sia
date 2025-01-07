import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Pagination } from '~/components/ui/pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Components/Primitives/Pagination',
  component: Pagination,
} as Meta;

export default meta;

type Story = StoryObj<typeof Pagination>

export const Default: Story = {
    args: {},
} 