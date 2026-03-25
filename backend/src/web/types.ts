export interface Author {
    name: string;
    role: string;
    imageUrl: string;
}

export interface GridItem {
    title: string;
    description: string;
}

export interface Service {
    id: string;
    slug: string;
    title: string;
    subtitle: string;
    description: string;
    interventionPoints: string[];
    imageUrl: string;
    ctaText: string;
    ctaMessage: string;
}

export interface Program {
    id: string;
    slug: string;
    title: string;
    subtitle: string;
    price: number;
    shortDescription: string;
    longDescription: string;

    // Sección: El Problema
    problemTitle: string;
    problemPoints: string[];

    // Sección: La Solución (Grid)
    solutionGrid: GridItem[];

    // Sección: Arquitectura / Estructura
    structure: GridItem[];
    duration: string;
    isOnline: boolean;

    imageUrl: string;
    author: Author;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    timestamp: string;
}
