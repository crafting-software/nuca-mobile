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

export const mockCat: Cat = {
  sex: 'M',
  notes:
    'Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown ',
  checkInDate: new Date(),
  checkOutDate: new Date(),
  isSterilized: true,
  capturedBy: { name: 'Ionel' },
  media: [
    'https://picsum.photos/200/300?random=1',
    'https://picsum.photos/200/300?random=3',
    'https://picsum.photos/200/300?random=5',
    'https://picsum.photos/200/300?random=9',
  ],
};
