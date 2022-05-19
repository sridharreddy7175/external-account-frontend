import { IExtensionResponse } from 'q2-tecton-sdk/dist/esm/sources/requestExtensionData';
import { Observable, of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { ofType, StateObservable } from 'redux-observable';
import { Dependencies } from '~/store';
import {
  AccountDetailsState,
  AccessTokenType,
  AccessTokenAction
} from '../reducer/accessToken';

export const fetchAccessTokenEpic = (
  action$: Observable<AccessTokenAction>,
  _payload: StateObservable<AccountDetailsState>,
  { tecton }: Dependencies
) =>
  action$.pipe(
    ofType(AccessTokenType.Fetch),
    mergeMap((_action: any) => {
      let result: any;
      if (tecton.sources?.requestExtensionData$) {
        result = tecton.sources
          .requestExtensionData$<any>({
            route: 'get_access_token',
            body: { token: _action.payload.token, data: _action.payload.data }
          })
          .pipe(
            map((res: IExtensionResponse<any>) => {
              return {
                type: AccessTokenType.FetchFinalized,
                payload: {
                  status: res.data.status,
                  accessToken: res?.data?.payload?.access_token
                }
              };
            }),
            catchError((err) =>
              of({
                type: AccessTokenType.FetchError,
                payload: { message: err.message, status: err.status }
              })
            )
          );
      }
      return result;
    })
  );

export default fetchAccessTokenEpic;
