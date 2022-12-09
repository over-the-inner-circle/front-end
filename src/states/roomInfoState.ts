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

export interface RoomUserList {
	"role": string;
	"user_id": string;
	"nickname": string;
	"prof_img": string;
	"mmr": number
	"created": string;
	"deleted": string;
}

export const roomUserListState = atom<RoomUserList | null>({
	key: 'roomUserList',
	default: null,
})
