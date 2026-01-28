export interface Shift {
    id:         number | null;
    start_time: string;
    status:     number | boolean;
    created_at?: Date;
    updated_at?: Date;
}
