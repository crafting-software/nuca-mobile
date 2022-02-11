export type Hotspot = {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
};

export const mockData: Hotspot[] = [
  {
    name: 'City center',
    description: 'near city center',
    latitude: 46.77119840460617,
    longitude: 23.59210914443709,
  },
  {
    name: 'EC Garden',
    description: 'near EC Garden',
    latitude: 46.77560721858744,
    longitude: 23.577346267298275,
  },
];
