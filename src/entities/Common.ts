import AppType from 'entities/AppType';

export type ID = string;
export type Role = keyof typeof AppType;
export type IgnoreElement = 'AppType' | 'Platform' | 'Authorization';
