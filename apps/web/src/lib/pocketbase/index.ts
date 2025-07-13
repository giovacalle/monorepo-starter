import Pocketbase from 'pocketbase';
import type { TypedPocketBase } from './pb-schema';
import { PUBLIC_PB_URL } from '$env/static/public';

export const createPbInstance = () => new Pocketbase(PUBLIC_PB_URL) as TypedPocketBase;

export const pb = createPbInstance();
