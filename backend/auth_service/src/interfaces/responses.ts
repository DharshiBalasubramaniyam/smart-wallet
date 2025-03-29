export interface ApiResponse {
    success: boolean;
    data: any;
    error: {message: string, error: string} | null
}
