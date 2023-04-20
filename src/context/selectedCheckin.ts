import { atom } from 'jotai';
import { Checkin } from '@/interfaces/Checkin';

export const selectedCheckinAtom = atom<Checkin | null>(null);
