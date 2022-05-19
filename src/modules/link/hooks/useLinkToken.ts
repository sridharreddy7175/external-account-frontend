import { useDispatch, useSelector } from 'react-redux';
import { State } from '~/store';
import { LinkTokenType, LinkTokenState } from '../reducer/linkToken';

export default function useLinkToken(): [LinkTokenState, () => object] {
  const dispatch = useDispatch();
  return [
    useSelector((state: State) => state.linkToken),
    () => dispatch({ type: LinkTokenType.Fetch })
  ];
}
