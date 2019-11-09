import React from 'react';
import { linkTo } from '@storybook/addon-links';
import App from '../src/App';
import { ShareElemLibPlayground } from '../src/demo/shared-element-demo-lib';
import './external.css';

export default {
  title: 'Welcome',
};

export const toStorybook = () => <ShareElemLibPlayground />;

toStorybook.story = {
  name: 'to Storybook',
};
