import { useDispatch, useSelector } from 'react-redux';
import { State } from '~/store';
import {
  ExternalAccountState,
  ExternalAccountType
} from '../reducer/externalAccount';

export default function useExternalAccount(): [
  ExternalAccountState,
  (
    metadata: any,
    accessToken: any,
    publicToken: string,
    accountType: string,
    uniqueId?: Number
  ) => object
] {
  const dispatch = useDispatch();
  return [
    useSelector((state: State) => state.externalAccount),
    (metadata, accessToken, publicToken, accountType, uniqueId) =>
      dispatch({
        type: ExternalAccountType.Fetch,
        payload: {
          data: metadata?.account_id,
          access_token: accessToken,
          public_token: publicToken,
          account_type: accountType,
          unique_id: uniqueId
        }
      })
  ];
}
