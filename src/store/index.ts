import OpinionatedRedux from 'opinionated-redux';
import { Q2TectonObservable } from '@nueve/q2-tecton-observable';
import defaultEpics from '~/epics';
import defaultReducers from '~/reducers';
import defaultInitialState, { State } from './initialState';

export interface Dependencies {
  tecton: Q2TectonObservable;
}

export function createStore(
  dependencies: Dependencies,
  initialState = defaultInitialState,
  reducers = defaultReducers,
  epics: any = defaultEpics
) {
  if (!Object.keys(reducers).length) return undefined;
  return new OpinionatedRedux<State>(reducers, initialState, epics, {
    devTools: true,
    reduxObservable: {
      dependencies
    }
  }).store;
}

export * from './initialState';
