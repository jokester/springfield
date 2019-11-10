import React from 'react';
import { linkTo } from '@storybook/addon-links';
import { ShareElemLibPlayground } from '../demo/share-elem-lib-demo';
import './external.css';

export default {
  title: 'Welcome',
};

export const toStorybook = () => <ShareElemLibPlayground />;

toStorybook.story = {
  name: 'to Storybook',
};
