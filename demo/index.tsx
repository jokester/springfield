import React from 'react';
import ReactDOM from 'react-dom';
import { SpringFieldIntro } from './springfield-intro';
import { ListDetailExample } from './list-detail-example';
import { TabSwitchExample } from './tab-switch-example';

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
      <SpringFieldIntro />
      <hr />
      <ListDetailExample />
      <hr />
      <TabSwitchExample />
    </>,
    document.getElementById('root') as HTMLElement,
  );
}

registerHMR();
render();
