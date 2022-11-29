import {atom} from 'recoil';

export interface RoomInfo {
	room_id: string;
	room_name: string;
	room_owner_id: string;
	room_access: 'public' | 'protected' | 'private';
	created: Date;
}

export const roomInfoState = atom<RoomInfo | null>({
	key: 'roomInfo',
	default: null,
})