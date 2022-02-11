import { User } from './User';

export type Cat = {
  readonly sex: string;
  readonly notes?: string;
  readonly checkInDate: Date;
  readonly checkOutDate: Date;
  readonly isSterilized: boolean;
  readonly capturedBy: User;
  readonly media: string[];
};

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
