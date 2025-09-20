import axios from 'axios';
import { api } from '../config/api.config';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {SpaceInfo} from "../interfaces/modals";
import { RootState } from '@/redux/store/store';
import { setSpaces } from '../redux/features/auth';
import { SpaceType } from '@/components/user.portal/views/Spaces';

export function SpaceService() {
    const dispatch = useDispatch();
    const token = useSelector((state: RootState) => state.auth.token)

    async function createSpace(body: SpaceInfo): Promise<void> {
        try {
            const response = await api.post(`space/`, body, {
                headers: {
                    "authorization": `Bearer ${token}`
                }
            });
            console.log(response.data)
            if (response.data.success) {
                const spaces: {id: string, name: string, type: SpaceType}[] = []
                response.data.data.object.forEach((s: any) => {
                    spaces.push({id: s._id, name: s.name, type: s.type})
                })
                dispatch(setSpaces({ spaces: spaces }))
                toast.success(response.data.data.message)
            }
        } catch (error) {
            processError(error)
        }
    }

    async function editSpace(id: string, body: SpaceInfo): Promise<void> {
        try {
            const response = await api.put(`space/${id}`, body, {
                headers: {
                    "authorization": `Bearer ${token}`
                }
            });
            console.log(response.data)
            if (response.data.success) {
                const spaces: {id: string, name: string, type: SpaceType}[] = []
                response.data.data.object.forEach((s: any) => {
                    spaces.push({id: s._id, name: s.name, type: s.type})
                })
                dispatch(setSpaces({ spaces: spaces }))
                toast.success(response.data.data.message)
            }
        } catch (error) {
            processError(error)
        }
    }


    async function deleteSpace(id: string): Promise<void> {
        try {
            const response = await api.delete(`space/${id}`, {
                headers: {
                    "authorization": `Bearer ${token}`
                }
            });
            console.log(response)
            if (response.data.success) {
                const spaces: {id: string, name: string, type: SpaceType}[] = []
                response.data.data.object.forEach((s: any) => {
                    spaces.push({id: s._id, name: s.name, type: s.type})
                })
                dispatch(setSpaces({ spaces: spaces }))
                toast.success(response.data.data.message)
            }
            
        } catch (error) {
            processError(error)
        }
    }

    async function getSpacesByUser(): Promise<void> {
        try {
            const response = await api.get(`space/user`, {
                headers: {
                    "authorization": `Bearer ${token}`
                }
            });
            console.log(response.data)
            if (response.data.success) {
                const spaces = response.data.data.object
            }
        } catch (error) {
            processError(error)
        }
    }

    return { createSpace, getSpacesByUser, editSpace, deleteSpace };
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
