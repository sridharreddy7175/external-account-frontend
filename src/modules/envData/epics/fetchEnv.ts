import { IExtensionResponse } from 'q2-tecton-sdk/dist/esm/sources/requestExtensionData';
import { Observable, of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { ofType, StateObservable } from 'redux-observable';
import { Dependencies } from '~/store';
import { EnvAction, EnvState, EnvType } from '../reducer/env';

export const fetchEnvEpic = (
  action$: Observable<EnvAction>,
  _payload: StateObservable<EnvState>,
  { tecton }: Dependencies
) =>
  action$.pipe(
    ofType(EnvType.Fetch),
    mergeMap((_action: any) => {
      let result: any;
      if (tecton.sources?.requestExtensionData$) {
        result = tecton.sources
          .requestExtensionData$<any>({
            route: 'get_env',
            body: {}
          })
          .pipe(
            map((res: IExtensionResponse<any>) => {
              return {
                type: EnvType.FetchFinalized,
                payload: res?.data?.payload
              };
            }),
            catchError((err) =>
              of({
                type: EnvType.FetchError,
                payload: { message: err.message, status: err.status }
              })
            )
          );
      }
      return result;
    })
  );

export default fetchEnvEpic;
