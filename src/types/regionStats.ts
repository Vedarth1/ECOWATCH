export interface RegionStats {
    region_name: string;
    state: string;
    city: string;
    valid_count: number;
    invalid_count: number;
    total_count: number;
    unmatched_count: number;
    registered_vehicles?: number;
    last_updated?: Date;
}