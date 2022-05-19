import { IExtensionResponse } from 'q2-tecton-sdk/dist/esm/sources/requestExtensionData';
import { Observable, of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { ofType, StateObservable } from 'redux-observable';
import { Dependencies } from '~/store';
import {
  ExternalAccountAction,
  ExternalAccountState,
  ExternalAccountType
} from '../reducer/externalAccount';

export const fetchExternalAccountEpic = (
  action$: Observable<ExternalAccountAction>,
  _payload: StateObservable<ExternalAccountState>,
  { tecton }: Dependencies
) =>
  action$.pipe(
    ofType(ExternalAccountType.Fetch),
    mergeMap((_action: any) => {
      let result: any;
      if (tecton.sources?.requestExtensionData$) {
        result = tecton.sources
          .requestExtensionData$<any>({
            route: _action.payload.unique_id
              ? 'add_non_plaid_external_account'
              : 'add_external_account',
            body: _action.payload.unique_id
              ? {
                  publicToken: _action.payload.public_token,
                  verificationStatus: _action.payload.access_token,
                  accountType: _action.payload.account_type,
                  accountId: _action.payload.data,
                  uniqueId: _action.payload.unique_id
                  // public_token,
                  // metadata?.accounts[0]?.verification_status,
                  // metadata?.accounts[0]?.subtype,
                  // metadata?.accounts[0]?.id,
                  // uniqueId
                }
              : {
                  data: _action.payload.data,
                  verificationStatus: _action.payload.access_token,
                  publicToken: _action.payload.public_token,
                  accountType: _action.payload.account_type
                }
          })
          .pipe(
            map((res: IExtensionResponse<any>) => {
              return {
                type: ExternalAccountType.FetchFinalized,
                payload: res.data.payload
              };
            }),
            catchError((err) =>
              of({
                type: ExternalAccountType.FetchError,
                payload: { message: err.message, status: err.status }
              })
            )
          );
      }
      return result;
    })
  );

export const deleteExternalAccount = (action$) =>
  action$.ofType(ExternalAccountType.FetchDelete).filter(() => {
    return {};
  });

export default fetchExternalAccountEpic;
