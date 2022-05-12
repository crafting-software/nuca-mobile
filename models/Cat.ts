import { castToUser, User } from './User';

export type Cat = {
  id: string;
  sex: 'M' | 'F';
  notes: string;
  checkInDate: number;
  checkOutDate: number;
  isSterilized: boolean;
  capturedBy?: User;
  media: Record<string, string>;
  isNew?: boolean;
};

export const castToCat = (backendCat: Record<string, any>): Cat => ({
  id: backendCat.id,
  capturedBy: backendCat.captured_by
    ? castToUser(backendCat.captured_by)
    : undefined,
  sex: backendCat.sex,
  notes: backendCat.notes || '',
  checkInDate: backendCat.check_in_date,
  checkOutDate: backendCat.check_out_date,
  isSterilized: backendCat.is_sterilized,
  media: backendCat.media,
});

export const getDateText = (timestamp: number): string => {
  const date = new Date(timestamp);
  const monthNames = [
    'ianuarie',
    'februarie',
    'martie',
    'aprilie',
    'mai',
    'iunie',
    'iulie',
    'august',
    'septembrie',
    'octombire',
    'noiembrie',
    'decembrie',
  ];
  return `${date.getDay()} ${
    monthNames[date.getMonth()]
  } ${date.getFullYear()}`;
};

export const defaultSterilizedCat: Cat = {
  id: (Math.floor(Math.random() * 100) + 1).toString(),
  sex: 'F',
  notes: '',
  checkInDate: new Date().getTime() / 1000,
  checkOutDate: new Date().getTime() / 1000,
  isSterilized: true,
  capturedBy: undefined,
  media: {},
  isNew: true,
};

export const defaultUnSterilizedCat: Cat = {
  id: (Math.floor(Math.random() * 100) + 1).toString(),
  sex: 'F',
  notes: '',
  checkInDate: new Date().getTime() / 1000,
  checkOutDate: new Date().getTime() / 1000,
  isSterilized: false,
  capturedBy: undefined,
  media: {},
  isNew: true,
};
