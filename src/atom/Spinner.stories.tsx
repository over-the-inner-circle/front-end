import { ComponentMeta, ComponentStory } from '@storybook/react';
import Spinner from './Spinner';

export default {
  title: 'atom/Spinner',
  component: Spinner,
} as ComponentMeta<typeof Spinner>;

const template: ComponentStory<typeof Spinner> = () => <Spinner />;

export const main = template.bind({});
main.args = {};
