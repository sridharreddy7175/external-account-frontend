import React, { FC, useEffect, useCallback, useState, ReactNode } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { Store } from 'redux';
import { TectonProvider } from 'q2-tecton-hooks';
import {
  createQ2TectonObservable,
  Q2TectonObservable
} from '@nueve/q2-tecton-observable';
import GitInfo from 'react-git-info/macro';
import { createStore } from '~/store';

let store: Store | void;
let tecton: Q2TectonObservable;

const gitInfo = GitInfo();

export interface AppProps {
  Component: FC<any>;
  pageProps: ReactNode;
}

let rerender = () => undefined;

const App: FC<AppProps> = ({ Component, pageProps }) => {
  const [, updateState] = useState(0);
  const forceRerender = useCallback(
    () => updateState((state: number) => ++state) as undefined,
    []
  );

  useEffect(() => {
    rerender = () => forceRerender();
  }, [rerender, forceRerender]);

  if (!tecton) return <>Loading . . .</>;

  function renderReduxProvider(children: ReactNode) {
    if (!store) return children;
    return <ReduxProvider store={store}>{children}</ReduxProvider>;
  }

  return (
    <TectonProvider tecton={tecton}>
      {renderReduxProvider(<Component {...pageProps} />)}
    </TectonProvider>
  );
};

App.defaultProps = {
  Component: (f) => f,
  pageProps: {}
};

export default App;

(async () => {
  if (typeof window === 'undefined') return;
  const { connect } = await import('q2-tecton-sdk');
  tecton = createQ2TectonObservable(await connect());
  store = createStore({ tecton });
  tecton.actions?.setFetching(false);
  const windowObj = window as any;
  rerender();

  const getAccountRecords = async () => {
    const data = await tecton?.sources?.requestExtensionData!<any>({
      route: 'get_records'
    });
  };
  windowObj.getAccountRecords = getAccountRecords;
  const getGitCommit = async () => {
    console.log(
      gitInfo.commit.message,
      gitInfo.commit.hash,
      gitInfo.commit.date
    );
  };
  windowObj.getGitCommit = getGitCommit;
})();
