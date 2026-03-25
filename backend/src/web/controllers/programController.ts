import { Request, Response } from 'express';
import { programs } from '../data/mock';
import { ApiResponse, Program } from '../types';

export const getAllPrograms = (req: Request, res: Response) => {
    const response: ApiResponse<Program[]> = {
        success: true,
        data: programs,
        timestamp: new Date().toISOString()
    };
    res.json(response);
};

export const getProgramBySlug = (req: Request, res: Response) => {
    const { slug } = req.params;
    const program = programs.find(p => p.slug === slug);

    if (!program) {
        res.status(404).json({
            success: false,
            data: null,
            timestamp: new Date().toISOString()
        });
        return;
    }

    const response: ApiResponse<Program> = {
        success: true,
        data: program,
        timestamp: new Date().toISOString()
    };
    res.json(response);
};
