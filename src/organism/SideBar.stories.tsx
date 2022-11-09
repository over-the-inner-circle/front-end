import { ComponentMeta, ComponentStory } from '@storybook/react';
import SideBar from './SideBar';

export default {
  title: 'organism/SideBar',
  component: SideBar,
} as ComponentMeta<typeof SideBar>;

const template: ComponentStory<typeof SideBar> = (args) => (
  <SideBar {...args} />
);

export const chat = template.bind({});
chat.args = {
  title: 'chat',
};
