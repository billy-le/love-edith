import { create } from 'domain';
import { createCtx } from './context.helpers';
import { App } from './context.interfaces';

export const [appContext, AppProvider] = createCtx<App.Context>();
