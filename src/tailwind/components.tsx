import React from 'react';
import './components.scss';

export const tailwind = {
  button: `p-2 inline-block border border-solid shadow-outline focus:outline-0`,
  verticalContainer: `flex p-4 justify-around`,
} as const;

export const Button: React.FC<{ title: string; onClick?(): void }> = props => (
  <button onClick={props.onClick} className={tailwind.button}>
    {props.title}
  </button>
);
