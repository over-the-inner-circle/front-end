import { ComponentMeta, ComponentStory } from '@storybook/react';
import SectionList from './SectionList';

export default {
  title: 'molecule/SectionList',
  component: SectionList,
} as ComponentMeta<typeof SectionList>;

const Template: ComponentStory<typeof SectionList> = (args) => (
  <div className="w-80">
    <SectionList {...args} />
  </div>
);

export const main = Template.bind({});
main.args = {
  sections: [
    {
      title: 'A',
      list: ['apple', 'april'],
    },
    {
      title: 'B',
      list: ['blue', 'bubble', 'bewhY'],
    },
    {
      title: 'C',
      list: ['circle', 'client'],
    },
  ],
  renderItem: (i: string) => <div className="p-5">{i}</div>,
  keyExtractor: (i: string) => i,
};
