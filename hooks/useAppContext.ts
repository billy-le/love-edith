import React from 'react';

import { appContext } from '@context';

export function useAppContext() {
  return React.useContext(appContext);
}
