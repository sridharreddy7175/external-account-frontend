import { useDispatch, useSelector } from 'react-redux';
import { State } from '~/store';
import {
  ExternalAccountState,
  ExternalAccountType
} from '../reducer/externalAccount';

export default function deleteAccount(): [ExternalAccountState, () => object] {
  const dispatch = useDispatch();
  return [
    useSelector((state: State) => state.externalAccount),
    () =>
      dispatch({
        type: ExternalAccountType.FetchDelete,
        payload: {}
      })
  ];
}
