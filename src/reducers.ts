import { ReducersMapObject } from 'redux';
import { State } from '~/store';
import { linkToken } from '~/modules/link/reducer';
import { accessToken as data } from '~/modules/accessToken/reducer';
import { env } from '~/modules/envData/reducer';
import { externalAccount } from '~/modules/externalAccount/reducer';

export default {
  linkToken,
  data,
  externalAccount,
  env
} as ReducersMapObject<State>;
