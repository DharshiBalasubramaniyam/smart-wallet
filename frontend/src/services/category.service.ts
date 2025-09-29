import axios from 'axios';
import { api } from '../config/api.config';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';
import { CategoryInfo } from '../interfaces/modals';

export function CategoryService() {
    const token = useSelector((state: RootState) => state.auth.token)

    async function getCategories(spaceType?: string): Promise<any[]> {
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

    async function getCategoriesBySpace(spaceType: string): Promise<any[]> {
        try {
            const response = await api.get(`category/space/${spaceType}`, {
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

    async function createSubCategory(body: any): Promise<void> {
        try {
            const response = await api.post(`category/sub`, body, {
                headers: {
                    "authorization": `Bearer ${token}`
                }
            });
            if (response.data.success) {
                console.log(response.data)
                toast.success(response.data.data.message)
            }
        } catch (error) {
            processError(error)
        }
    }

    async function updateSubCategory(body: any): Promise<void> {
        try {
            const response = await api.put(`category/sub`, body, {
                headers: {
                    "authorization": `Bearer ${token}`
                }
            });
            if (response.data.success) {
                console.log(response.data)
                toast.success(response.data.data.message)
            }
        } catch (error) {
            processError(error)
        }
    }

    async function deleteSubCategory(pid: string, sid: string): Promise<void> {
        try {
            const response = await api.delete(`category/sub/${pid}/${sid}`, {
                headers: {
                    "authorization": `Bearer ${token}`
                }
            });
            if (response.data.success) {
                console.log(response.data)
                toast.success(response.data.data.message)
            }
        } catch (error) {
            processError(error)
        }
    }

    async function createMainCategory(body: any): Promise<void> {
        try {
            const response = await api.post(`category/main`, body, {
                headers: {
                    "authorization": `Bearer ${token}`
                }
            });
            if (response.data.success) {
                console.log(response.data)
                toast.success(response.data.data.message)
            }
        } catch (error) {
            processError(error)
        }
    }

    return { getCategories, getCategoriesBySpace, createSubCategory, updateSubCategory, deleteSubCategory, createMainCategory };
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
