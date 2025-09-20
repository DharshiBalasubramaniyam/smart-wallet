import axios from 'axios';
import { api } from '../config/api.config';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';
import { CategoryInfo } from '../interfaces/modals';

export function CategoryService() {
    const token = useSelector((state: RootState) => state.auth.token)

    async function getCategories(): Promise<CategoryInfo[]> {
        try {
            const response = await api.get(`category/`, {
                headers: {
                    "authorization": `Bearer ${token}`
                }
            });
            if (response.data.success) {
                return response.data.data.object
            }
            return []
        } catch (error) {
            processError(error)
            return []
        }
    }

    return { getCategories };
}

function processError(error: unknown): void {
    if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data?.error?.message || "An error occurred while processing your request.";
        toast.error(errorMessage);
    } else {
        toast.error("An unexpected error occurred. Please try again later.");
    }
    console.error("Error details:", error);
}
