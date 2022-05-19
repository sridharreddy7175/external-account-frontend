import { AccountDetails, HashMap } from '~/types';

export interface State {
  linkToken: HashMap;
  data: AccountDetails;
  externalAccount: HashMap;
  env: HashMap;
}

const initialState: State = {
  linkToken: {},
  data: { accessToken: '', status: '' },
  externalAccount: {},
  env: {}
};

export default initialState;
