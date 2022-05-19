import { useDispatch, useSelector } from 'react-redux';
import { State } from '~/store';
import { AccessTokenType, AccountDetailsState } from '../reducer/accessToken';

export default function useAccessToken(): [
  AccountDetailsState,
  (metadata: any) => object
] {
  const dispatch = useDispatch();
  return [
    useSelector((state: State) => state.data),
    (metadata) =>
      dispatch({
        type: AccessTokenType.Fetch,
        payload: {
          token: metadata?.public_token,
          data: metadata?.account_id
        }
      })
  ];
}
