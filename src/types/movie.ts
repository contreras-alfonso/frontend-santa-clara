import type { Shift } from "./shift";

export interface Movie {
    id:               number | null;
    name:             string;
    publication_date: string;
    image:            null | string;
    status:           number | boolean;
    created_at?:      Date;
    updated_at?:      Date;
    shifts:           Shift[];
}
