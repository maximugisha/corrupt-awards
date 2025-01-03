// src/types/interfaces.ts


// Base interfaces for optional relationships

interface BaseUser {
    name: string;
    image?: string;
}

export interface Rating {
    id: number;
    score: number;
    severity: number;
    evidence: string | null;
    createdAt: string;
    user?: BaseUser;
    ratingCategory: {
      name: string;
      icon: string;
    };
  }
   

export interface Comment {
    id: number;
    userId: number;
    nomineeId?: number;
    institutionId?: number;
    content: string;
    createdAt: string;
    user: BaseUser;
}

export interface InstitutionRating {
    id: number;
    userId: number;
    institutionId: number;
    ratingCategoryId: number;
    score: number;
    severity: number;
    evidence: string | null;
    createdAt: string;
    ratingCategory: RatingCategory;
}

export interface RatingCategory {
    id: number;
    keyword: string;
    name: string;
    icon: string;
    description: string;
    weight: number;
    examples: string[];
    createdAt: string;
}

export interface Position {
    id: number;
    name: string;
    status: boolean;
    createdAt: string;
    nominees?: Nominee[];
}

export interface Institution {
  id: number;
  image?: string;
  name: string;
  status: boolean;
  nominees?: Nominee[];
  rating: InstitutionRating[];
  comments?: Comment[];
  createdAt: string;
}

export interface District {
    id: number;
    name: string;
    region: string;
    status: boolean;
    createdAt: string;
    nominees?: Nominee[];
}

export interface Nominee {
    id: number;
    name: string;
    image?: string;
    positionId: number;
    institutionId: number;
    districtId: number;
    status: boolean;
    evidence: string | null;
    comments?: Comment[];
    createdAt: string;
    rating: Rating[];
    position: Position;
    institution: Institution;
    district: District;
}

// Response types with proper generics
export interface BaseResponse<T> {
    count: number;
    pages: number;
    currentPage: number;
    data: T[];
}

export type NomineeResponse = BaseResponse<Nominee>;
export type InstitutionResponse = BaseResponse<Institution>;
export type CommentResponse = BaseResponse<Comment>;
export type DistrictResponse = BaseResponse<District>;
export type PositionResponse = BaseResponse<Position>;