import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import Friends from './Friends';

export default {
  title: 'organism/Friends',
  component: Friends,
} as ComponentMeta<typeof Friends>;

const Template: ComponentStory<typeof Friends> = () => (
  <MemoryRouter>
    <Friends />
  </MemoryRouter>
);

export const main = Template.bind({});
main.args = {};
