import { camelCase } from 'lodash';
import doneMarker from '../assets/marker-done.png';
import inProgressMarker from '../assets/marker-in-progress.png';
import todoMarker from '../assets/marker-todo.png';
import { castToCat, Cat } from './Cat';
import { castToUser, User } from './User';

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
  city: string;
  zip: string;
  description: string;
  notes: string;
  sterilizedCats: Cat[];
  unsterilizedCats: Cat[];
  unsterilizedCatsCount: number; // this gets a manual input and might be different from the unsterilizedCats array length
  contactName: string;
  contactPhone: string;
  volunteer?: User;
};

export const getHotspotMarker = ({ status }: Partial<Hotspot>) => {
  if (status === HotspotStatus.done) return doneMarker;
  if (status === HotspotStatus.inProgress) return inProgressMarker;
  return todoMarker;
};

export const castToHotspot = ({
  id,
  latitude,
  longitude,
  status,
}: Record<string, any>) => ({
  id,
  latitude: parseFloat(latitude),
  longitude: parseFloat(longitude),
  status: HotspotStatus[camelCase(status) as keyof typeof HotspotStatus],
});

export const castToHotspotDetails = (
  data: Record<string, any>
): HotspotDetails => ({
  ...castToHotspot(data),
  address: data.address,
  city: data.city,
  zip: data.zip,
  description: data.description,
  notes: data.notes,
  sterilizedCats: data.sterilized_cats.map(castToCat),
  unsterilizedCats: data.unsterilized_cats.map(castToCat),
  unsterilizedCatsCount: data.total_unsterilized_cats,
  contactName: data.contact_name,
  contactPhone: data.contact_phone,
  volunteer: data.volunteer ? castToUser(data.volunteer) : undefined,
});

export const toApiModel = (hotspot: HotspotDetails): Record<string, any> => ({
  ...hotspot,
  contact_name: hotspot.contactName,
  contact_phone: hotspot.contactPhone,
  latitude: hotspot.latitude.toString(),
  longitude: hotspot.longitude.toString(),
  status:
    Object.keys(HotspotStatus)
      [
        Object.values(HotspotStatus).indexOf(
          hotspot.status as unknown as HotspotStatus
        )
      ].charAt(0)
      .toUpperCase() +
    Object.keys(HotspotStatus)[
      Object.values(HotspotStatus).indexOf(
        hotspot.status as unknown as HotspotStatus
      )
    ].slice(1),
  total_unsterilized_cats: hotspot.unsterilizedCatsCount,
  volunteer_id: hotspot.volunteer?.id,
});

export const defaultHotspotDetails: HotspotDetails = {
  id: '',
  status: HotspotStatus.toDo,
  latitude: 0,
  longitude: 0,
  address: '',
  city: '',
  zip: '',
  description: '',
  notes: '',
  sterilizedCats: [],
  unsterilizedCats: [],
  unsterilizedCatsCount: 0,
  contactName: '',
  contactPhone: '',
};
