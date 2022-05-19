import { connect } from '@nueve/q2-tecton-mock';
import { createQ2TectonObservable } from '@nueve/q2-tecton-observable';
import { createStore } from '.';

describe('createStore()', () => {
  it('should create store', async () => {
    const tecton = createQ2TectonObservable(await connect());
    const store = createStore(
      { tecton },
      // @ts-ignore
      { deleteMe: null },
      { deleteMe: () => null }
    )!;
    expect(typeof store.dispatch).toBe('function');
    expect(typeof store.getState).toBe('function');
    expect(typeof store.replaceReducer).toBe('function');
    expect(typeof store.subscribe).toBe('function');
  });
});
