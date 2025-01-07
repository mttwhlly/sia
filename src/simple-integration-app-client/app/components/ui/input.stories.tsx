import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Input } from '~/components/ui/input';

const meta: Meta<typeof Input> = {
  title: 'Components/Primitives/Input',
  component: Input,
} as Meta;

export default meta;

type Story = StoryObj<typeof Input>

export const Default: Story = {
    args: {
        placeholder: 'Input',
    },
} 