import { Action, HashMap } from '~/types';

export enum EnvType {
  Fetch = 'ENV_FETCH',
  FetchFinalized = 'ENV_FETCH_FINALIZED',
  FetchError = 'ENV_FETCH_ERROR'
}

export type EnvAction = Action<EnvType, EnvState>;

export type EnvState = HashMap;

const env: any = (state: EnvState = {}, { type, payload }: EnvAction) => {
  switch (type) {
    case EnvType.FetchFinalized:
      return payload;
    case EnvType.FetchError:
      return payload;
    default:
      return state;
  }
};

export default env;
