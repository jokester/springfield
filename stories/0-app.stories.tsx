import React from 'react';
import { linkTo } from '@storybook/addon-links';
import './external.css';
import { TabSwitchExample } from "../demo/tab-switch-example";

export default {
  title: 'Welcome',
};

export const toStorybook = () => <TabSwitchExample />;

toStorybook.story = {
  name: 'to Storybook',
};
