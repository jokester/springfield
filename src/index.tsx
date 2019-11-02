import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { ShareElemPlayground2 } from './shared-element-demo';
import { ShareElemPlayground1 } from './poc-shared-elem-transition/exp';

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
      <ShareElemPlayground1 />
      <ShareElemPlayground2 />
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
