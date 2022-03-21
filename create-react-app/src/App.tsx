import React, { useState } from 'react';

import { CdsButton } from '@cds/react/button';
import { CdsAlert, CdsAlertGroup } from '@cds/react/alert';
import './App.css';

interface AppProps { }

export function App(props: AppProps) {
  const [show, setShow] = useState<boolean>(false);

  return (
    <main cds-layout="vertical gap:lg p:lg">
      <h1 cds-text="heading">Clarity + React Starter</h1>

      <div cds-layout="horizontal gap:sm">
        <a cds-text="link" href="https://clarity.design/storybook/core">Clarity Docs</a>
        <a cds-text="link" href="https://reactjs.org/">React Docs</a>
      </div>

      <CdsButton action="outline" onClick={() => setShow(true)}>Hello There</CdsButton>

      {show ? (
        <CdsAlertGroup status="info">
          <CdsAlert onCloseChange={() => setShow(false)} closable>you are a bold one...</CdsAlert>
        </CdsAlertGroup>
      ) : (
        ''
      )}
    </main>
  );
}
