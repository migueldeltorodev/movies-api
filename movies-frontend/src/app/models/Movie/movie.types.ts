export interface MovieStats {
    totalRatings: number;
    averageRating: number;
    ratingDistribution: {
        [rating: number]: number;
    };
}

export interface PosterInfo {
    url?: string;
    fileName?: string;
    uploadedAt?: string;
    size?: number;
    mimeType?: string;
}
