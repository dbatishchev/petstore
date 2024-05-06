/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Order {
  /**
   * @format int64
   * @example 10
   */
  id?: number;
  /**
   * @format int64
   * @example 198772
   */
  petId?: number;
  /**
   * @format int32
   * @example 7
   */
  quantity?: number;
  /** @format date-time */
  shipDate?: string;
  /**
   * Order Status
   * @example "approved"
   */
  status?: OrderStatusEnum;
  complete?: boolean;
}

export interface Customer {
  /**
   * @format int64
   * @example 100000
   */
  id?: number;
  /** @example "fehguy" */
  username?: string;
  address?: Address[];
}

export interface Address {
  /** @example "437 Lytton" */
  street?: string;
  /** @example "Palo Alto" */
  city?: string;
  /** @example "CA" */
  state?: string;
  /** @example 94301 */
  zip?: string;
}

export interface Category {
  /**
   * @format int64
   * @example 1
   */
  id?: number;
  /** @example "Dogs" */
  name?: string;
}

export interface User {
  /**
   * @format int64
   * @example 10
   */
  id?: number;
  /** @example "theUser" */
  username?: string;
  /** @example "John" */
  firstName?: string;
  /** @example "James" */
  lastName?: string;
  /** @example "john@email.com" */
  email?: string;
  /** @example 12345 */
  password?: string;
  /** @example 12345 */
  phone?: string;
  /**
   * User Status
   * @format int32
   * @example 1
   */
  userStatus?: number;
}

export interface Tag {
  /** @format int64 */
  id?: number;
  name?: string;
}

export interface Pet {
  /**
   * @format int64
   * @example 10
   */
  id?: number;
  /** @example "doggie" */
  name: string;
  category?: Category;
  photoUrls: string[];
  tags?: Tag[];
  /** pet status in the store */
  status?: PetStatusEnum;
}

export interface ApiResponse {
  /** @format int32 */
  code?: number;
  type?: string;
  message?: string;
}

/**
 * Order Status
 * @example "approved"
 */
export enum OrderStatusEnum {
  Placed = 'placed',
  Approved = 'approved',
  Delivered = 'delivered',
}

/** pet status in the store */
export enum PetStatusEnum {
  Available = 'available',
  Pending = 'pending',
  Sold = 'sold',
}

/**
 * Status values that need to be considered for filter
 * @default "available"
 */
export enum FindPetsByStatusParamsStatusEnum {
  Available = 'available',
  Pending = 'pending',
  Sold = 'sold',
}
