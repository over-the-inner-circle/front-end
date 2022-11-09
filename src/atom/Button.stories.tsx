import { ComponentMeta, ComponentStory } from '@storybook/react';
import Button from './Button';

export default {
  title: 'atom/Button',
  component: Button,
} as ComponentMeta<typeof Button>;

const template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const green = template.bind({});
green.args = {
  children: 'Button',
  type: 'button',
  className: 'bg-green-600 hover:bg-green-700 active:bg-green-800',
};

export const sky = template.bind({});
sky.args = {
  children: 'Button',
  className: 'bg-sky-600 hover:bg-sky-700 active:bg-sky-800',
};
