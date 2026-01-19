import * as LikeAPIUtil from '../util/like_api_util';
import { Dispatch } from 'redux';
import { Like, OnePage } from '../types';
import { AxiosResponse } from 'axios';

// Action Types
export const RECEIVE_ALL_LIKES = 'RECEIVE_ALL_LIKES' as const;
export const RECEIVE_LIKE = 'RECEIVE_LIKE' as const;

// Action Interfaces
export interface ReceiveAllLikesAction {
  type: typeof RECEIVE_ALL_LIKES;
  likes: Record<string, Like>;
}

export interface ReceiveLikeAction {
  type: typeof RECEIVE_LIKE;
  like: {
    onePageId: string;
    onePage: OnePage;
  };
}

export type LikeAction = ReceiveAllLikesAction | ReceiveLikeAction;

// Action Creators
const receiveAllLikes = (likes: AxiosResponse<Record<string, Like>>): ReceiveAllLikesAction => {
  return {
    type: RECEIVE_ALL_LIKES,
    likes: likes.data
  };
};

const receiveLike = (like: AxiosResponse<Like>): ReceiveLikeAction => ({
  type: RECEIVE_LIKE,
  like: like.data as unknown as { onePageId: string; onePage: OnePage }
});

// Thunk Actions
export const fetchLike = (id: string) => (dispatch: Dispatch<LikeAction>) => (
  LikeAPIUtil.fetchLike(id).then(like => dispatch(receiveLike(like)))
);

export const createLike = (like: { OnepageId: string }) => (dispatch: Dispatch<LikeAction>) => (
  LikeAPIUtil.createLike(like).then(like => dispatch(receiveLike(like)))
);

export const fetchLikes = () => (dispatch: Dispatch<LikeAction>) => (
  LikeAPIUtil.fetchLikes().then(likes => dispatch(receiveAllLikes(likes)))
);
