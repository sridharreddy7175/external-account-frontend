import { IExtensionResponse } from 'q2-tecton-sdk/dist/esm/sources/requestExtensionData';
import { Observable, of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { ofType, StateObservable } from 'redux-observable';
import { Dependencies } from '~/store';
import {
  LinkTokenAction,
  LinkTokenState,
  LinkTokenType
} from '../reducer/linkToken';

export const fetchLinkTokenEpic = (
  action$: Observable<LinkTokenAction>,
  _payload: StateObservable<LinkTokenState>,
  { tecton }: Dependencies
) =>
  action$.pipe(
    ofType(LinkTokenType.Fetch),
    mergeMap((_action: LinkTokenAction) => {
      let result: any;
      if (tecton.sources?.requestExtensionData$) {
        result = tecton.sources
          .requestExtensionData$<any>({
            route: 'get_link_token',
            body: {}
          })
          .pipe(
            map((res: IExtensionResponse<any>) => {
              return {
                type: LinkTokenType.FetchFinalized,
                payload: { token: res?.data?.payload?.data }
              };
            }),
            catchError((err) =>
              of({
                type: LinkTokenType.FetchError,
                payload: { message: err.message, status: err.status }
              })
            )
          );
      }
      return result;
    })
  );

export default fetchLinkTokenEpic;
