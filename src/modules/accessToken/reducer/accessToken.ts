import { Action, AccountDetails } from '~/types';

export enum AccessTokenType {
  Fetch = 'ACCESS_TOKEN_FETCH',
  FetchFinalized = 'ACCESS_TOKEN_FETCH_FINALIZED',
  FetchError = 'ACCESS_TOKEN_FETCH_ERROR'
}

export type AccessTokenAction = Action<AccessTokenType, AccountDetailsState>;

export type AccountDetailsState = AccountDetails;

const accessToken: any = (
  state: AccountDetailsState = { status: '', accessToken: '' },
  { type, payload }: AccessTokenAction
) => {
  switch (type) {
    case AccessTokenType.FetchFinalized:
      return payload;
    case AccessTokenType.FetchError:
      return payload;
    default:
      return state;
  }
};

export default accessToken;
