import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { ShareElemLibPlayground } from './demo/shared-element-demo-lib';
import { ShareElemPocPlayground } from './demo/shared-element-demo-poc';

function registerHMR() {
  type ModuleHMR = typeof module & {
    hot?: {
      accept(dependencies: string | string[], callback: (updatedDependencies: any[]) => void): void;
      accept(callback: (updatedDependencies: any[]) => void): void;
    };
  };

  if ((module as ModuleHMR).hot) {
    (module as ModuleHMR).hot!.accept(render);
  }
}

function render() {
  ReactDOM.render(
    <>
      <ShareElemPocPlayground />
      <ShareElemLibPlayground />
    </>,
    document.getElementById('root') as HTMLElement,
  );
}

registerHMR();
render();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
