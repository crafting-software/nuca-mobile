import doneMarker from '../assets/marker-done.png';
import inProgressMarker from '../assets/marker-in-progress.png';
import todoMarker from '../assets/marker-todo.png';

export enum HotspotStatus {
  toDo = 'în așteptare',
  inProgress = 'în lucru',
  done = 'finalizat',
}

export const hotspotStatusList: HotspotStatus[] = [
  HotspotStatus.toDo,
  HotspotStatus.inProgress,
  HotspotStatus.done,
];

export const HotspotStatusValue = (value: string) => {
  if (value === HotspotStatus.toDo) return HotspotStatus.toDo;
  if (value === HotspotStatus.inProgress) return HotspotStatus.inProgress;
  return HotspotStatus.done;
};

export type Hotspot = {
  id: string;
  status: HotspotStatus;
  latitude: number;
  longitude: number;
};

export type HotspotDetails = Hotspot & {
  address: string;
  details: string;
  notes: string;
  // cats and other data
};

export const getHotspotMarker = ({ status }: Partial<Hotspot>) => {
  if (status === HotspotStatus.done) return doneMarker;
  if (status === HotspotStatus.inProgress) return inProgressMarker;
  return todoMarker;
};
