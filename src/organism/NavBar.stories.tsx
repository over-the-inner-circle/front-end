import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useEffect, useState } from 'react';
import NavBar, { SidebarItem } from './NavBar';

export default {
  title: 'organism/NavBar',
  component: NavBar,
  argTypes: { setSidebarIndex: { action: 'clicked icon' } },
} as ComponentMeta<typeof NavBar>;

const Template: ComponentStory<typeof NavBar> = (args) => {
  const [item, setItem] = useState<SidebarItem>(args.sidebarIndex);

  useEffect(() => {
    setItem(args.sidebarIndex);
  }, [args.sidebarIndex]);

  return <NavBar {...args} sidebarIndex={item} setSidebarIndex={setItem} />;
};

export const main = Template.bind({});
main.args = {
  user: { name: 'seushin', profUrl: 'https://picsum.photos/38' },
};
