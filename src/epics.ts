import { fetchLinkTokenEpic } from '~/modules/link/epics';
import { fetchAccessTokenEpic } from '~/modules/accessToken/epics';
import { fetchExternalAccountEpic } from '~/modules/externalAccount/epics';
import { fetchEnvEpic } from '~/modules/envData/epics';

export default [
  fetchLinkTokenEpic,
  fetchAccessTokenEpic,
  fetchExternalAccountEpic,
  fetchEnvEpic
];
