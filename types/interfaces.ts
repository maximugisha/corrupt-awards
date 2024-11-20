// src/types/interfaces.ts

export interface Rating {
    id: number;
    userId: number;
    nomineeId: number;
    ratingCategoryId: number;
    score: number;
    severity: number;
    evidence: string | null;
    createdAt: string;
    ratingCategory: RatingCategory;
}

export interface InstitutionRating {
    id: number;
    userId: number;
    nomineeId: number;
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
    createdAt: string;
}

export interface Institution {
    id: number;
    name: string;
    rating: InstitutionRating[];
    createdAt: string;
}

export interface District {
    id: number;
    name: string;
    region: string;
    createdAt: string;
}

export interface Nominee {
    id: number;
    name: string;
    positionId: number;
    institutionId: number;
    districtId: number;
    status: boolean;
    evidence: string | null;
    createdAt: string;
    rating: Rating[];
    position: Position;
    institution: Institution;
    district: District;
}

export interface NomineeResponse {
    count: number;
    pages: number;
    currentPage: number;
    data: Nominee[];
}

export interface InstitutionResponse {
    count: number;
    pages: number;
    currentPage: number;
    data: Nominee[];
}
