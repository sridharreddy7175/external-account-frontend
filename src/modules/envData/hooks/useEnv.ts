import { useDispatch, useSelector } from 'react-redux';
import { State } from '~/store';
import { EnvState, EnvType } from '../reducer/env';

export default function useEnv(): [EnvState, () => object] {
  const dispatch = useDispatch();
  return [
    useSelector((state: State) => state.env),
    () => dispatch({ type: EnvType.Fetch })
  ];
}
