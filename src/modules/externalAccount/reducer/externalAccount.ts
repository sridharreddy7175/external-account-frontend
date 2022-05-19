import { Action, HashMap } from '~/types';

export enum ExternalAccountType {
  Fetch = 'EXTERNAL_ACCOUNT_FETCH',
  FetchFinalized = 'EXTERNAL_ACCOUNT_FETCH_FINALIZED',
  FetchError = 'EXTERNAL_ACCOUNT_FETCH_ERROR',
  FetchDelete = 'DELETE_EXTERNAL_ACCOUNT'
}

export type ExternalAccountAction = Action<
  ExternalAccountType,
  ExternalAccountState
>;

export type ExternalAccountState = HashMap;
const externalAccount: any = (
  state: ExternalAccountState = {},
  { type, payload }: ExternalAccountAction
) => {
  switch (type) {
    case ExternalAccountType.FetchFinalized:
      return payload;
    case ExternalAccountType.FetchError:
      return payload;
    case ExternalAccountType.FetchDelete:
      return payload;
    default:
      return state;
  }
};

export default externalAccount;
