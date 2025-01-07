import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Card } from '~/components/ui/card';

const meta: Meta<typeof Card> = {
  title: 'Components/Primitives/Card',
  component: Card,
} as Meta;

export default meta;

type Story = StoryObj<typeof Card>

export const Default: Story = {
    args: {
        
    },
} 