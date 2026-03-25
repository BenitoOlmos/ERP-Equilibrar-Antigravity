import { Request, Response } from 'express';
import { services } from '../data/mock';
import { ApiResponse, Service } from '../types';

export const getAllServices = (req: Request, res: Response) => {
    const response: ApiResponse<Service[]> = {
        success: true,
        data: services,
        timestamp: new Date().toISOString()
    };
    res.json(response);
};

export const getServiceBySlug = (req: Request, res: Response) => {
    const { slug } = req.params;
    const service = services.find(s => s.slug === slug);

    if (!service) {
        res.status(404).json({
            success: false,
            data: null,
            timestamp: new Date().toISOString()
        });
        return;
    }

    const response: ApiResponse<Service> = {
        success: true,
        data: service,
        timestamp: new Date().toISOString()
    };
    res.json(response);
};
