import { Action, HashMap } from '~/types';

export enum LinkTokenType {
  Fetch = 'LINK_TOKEN_FETCH',
  FetchFinalized = 'LINK_TOKEN_FETCH_FINALIZED',
  FetchError = 'LINK_TOKEN_FETCH_ERROR'
}

export type LinkTokenAction = Action<LinkTokenType, LinkTokenState>;

export type LinkTokenState = HashMap;

const linkToken: any = (
  state: LinkTokenState = {},
  { type, payload }: LinkTokenAction
) => {
  switch (type) {
    case LinkTokenType.FetchFinalized:
      return payload;
    case LinkTokenType.FetchError:
      return payload;
    default:
      return state;
  }
};

export default linkToken;
