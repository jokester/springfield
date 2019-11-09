import React from 'react';
import ReactDOM from 'react-dom';
import { ShareElemLibPlayground } from './demo/shared-element-demo-lib';

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
      <ShareElemLibPlayground />
    </>,
    document.getElementById('root') as HTMLElement,
  );
}

registerHMR();
render();
