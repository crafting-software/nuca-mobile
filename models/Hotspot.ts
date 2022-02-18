import doneMarker from '../assets/marker-done.png';
import inProgressMarker from '../assets/marker-in-progress.png';
import todoMarker from '../assets/marker-todo.png';

export enum HotspotStatus {
  toDo = 'în așteptare',
  inProgress = 'în lucru',
  done = 'finalizat',
}

export type Hotspot = {
  name: string;
  description: string;
  status: HotspotStatus;
  latitude: number;
  longitude: number;
};

export const getHotspotMarker = ({ status }: Hotspot) => {
  if (status === HotspotStatus.done) return doneMarker;
  if (status === HotspotStatus.inProgress) return inProgressMarker;
  return todoMarker;
};

export const mockData: Hotspot[] = [
  {
    name: 'City center',
    description: 'near city center',
    latitude: 46.77119840460617,
    longitude: 23.59210914443709,
    status: HotspotStatus.inProgress,
  },
  {
    name: 'EC Garden',
    description: 'near EC Garden',
    latitude: 46.77560721858744,
    longitude: 23.577346267298275,
    status: HotspotStatus.done,
  },
  {
    name: 'Parcul Central',
    description: 'langa cazino',
    latitude: 46.76922365482081,
    longitude: 23.57742103662254,
    status: HotspotStatus.toDo,
  },
];
