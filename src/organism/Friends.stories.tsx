import { ComponentMeta, ComponentStory } from '@storybook/react';
import Friends from './Friends';

export default {
  title: 'organism/Friends',
  component: Friends,
} as ComponentMeta<typeof Friends>;

const Template: ComponentStory<typeof Friends> = (args) => (
  <Friends {...args} />
);
export const main = Template.bind({});
main.args = {
};
