import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import Friends from './Friends';
import { friendAll, friendAllError } from '@/mock/handler';

export default {
  title: 'organism/Friends',
  component: Friends,
} as ComponentMeta<typeof Friends>;

const queryClient = new QueryClient();

const Template: ComponentStory<typeof Friends> = () => (
  <QueryClientProvider client={queryClient}>
    <MemoryRouter>
      <Friends />
    </MemoryRouter>
  </QueryClientProvider>
);

export const main = Template.bind({});
main.args = {};
main.parameters = {
  msw: {
    handlers: [friendAll],
  },
};

export const notFound = Template.bind({});
notFound.args = {};
notFound.parameters = {
  msw: {
    handlers: [friendAllError],
  },
};
