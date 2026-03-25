import { ApiResponse, Program, Service } from '../types';
import { fallbackPrograms, fallbackServices } from '../data/fallback';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const api = {
    getPrograms: async (): Promise<Program[]> => {
        try {
            const res = await fetch(`${API_URL}/programs`);
            if (!res.ok) throw new Error('Network response was not ok');
            const json: ApiResponse<Program[]> = await res.json();
            return json.data;
        } catch (error) {
            console.warn("Backend offline or request failed. Using fallback data for programs.");
            return fallbackPrograms;
        }
    },
    getProgramBySlug: async (slug: string): Promise<Program | null> => {
        try {
            const res = await fetch(`${API_URL}/programs/${slug}`);
            if (!res.ok) {
                if (res.status === 404) return null; // Genuine 404 from server
                throw new Error('Network response was not ok');
            }
            const json: ApiResponse<Program> = await res.json();
            return json.data;
        } catch (error) {
            console.warn(`Backend offline or request failed. Using fallback data for program: ${slug}`);
            const found = fallbackPrograms.find(p => p.slug === slug);
            console.log('Fallback found:', found); // Debug
            return found || null;
        }
    },
    getServices: async (): Promise<Service[]> => {
        try {
            const res = await fetch(`${API_URL}/services`);
            if (!res.ok) throw new Error('Network response was not ok');
            const json: ApiResponse<Service[]> = await res.json();
            return json.data;
        } catch (error) {
            console.warn("Backend offline or request failed. Using fallback data for services.");
            return fallbackServices;
        }
    },
    getServiceBySlug: async (slug: string): Promise<Service | null> => {
        try {
            const res = await fetch(`${API_URL}/services/${slug}`);
            if (!res.ok) {
                if (res.status === 404) return null;
                throw new Error('Network response was not ok');
            }
            const json: ApiResponse<Service> = await res.json();
            return json.data;
        } catch (error) {
            console.warn(`Backend offline or request failed. Using fallback data for service: ${slug}`);
            return fallbackServices.find(s => s.slug === slug) || null;
        }
    }
};
