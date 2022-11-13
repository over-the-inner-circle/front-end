import { ComponentMeta, ComponentStory } from '@storybook/react';
import Circle from './Circle';

export default {
  title: 'atom/Circle',
  component: Circle,
} as ComponentMeta<typeof Circle>;

const template: ComponentStory<typeof Circle> = (args) => <Circle {...args} />;

export const green = template.bind({});
green.args = {
  radius: 30,
  style: 'fill-green-500',
};

export const amber = template.bind({});
amber.args = {
  radius: 30,
  style: 'fill-amber-500',
};

export const grey = template.bind({});
grey.args = {
  radius: 30,
  style: 'fill-neutral-500',
};
