import { Meta } from '@storybook/nextjs-vite';
import { EventList } from './EventList';

const meta = {
    title: 'Features/Dashboard/EventList',
    component: EventList,
    tags: ['autodocs'],
} satisfies Meta<typeof EventList>;

export default meta;

export const Default = {
    args: {},
};