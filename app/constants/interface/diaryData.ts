export interface DiaryData {

    id: string;
    created_at: Date;
    glucose: number;
    carbs: number;
    insulin: number;
    meal_type: string;
    activity_level: string;
    note: string;
    uri_array: [];

}