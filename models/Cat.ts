import { castToUser, User } from './User';

export type Cat = {
  id: string;
  sex: 'M' | 'F';
  notes: string;
  checkInDate: Date;
  checkOutDate: Date;
  isSterilized: boolean;
  capturedBy?: User;
  media: Record<string, string>;
};

export const castToCat = (backendCat: Record<string, any>): Cat => ({
  id: backendCat.id,
  capturedBy: backendCat.captured_by
    ? castToUser(backendCat.captured_by)
    : undefined,
  sex: backendCat.sex,
  notes: backendCat.notes || '',
  checkInDate: new Date(backendCat.check_in_date),
  checkOutDate: new Date(backendCat.check_out_date),
  isSterilized: backendCat.is_sterilized,
  media: backendCat.media,
});

export const getDateText = (date: Date): string => {
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
