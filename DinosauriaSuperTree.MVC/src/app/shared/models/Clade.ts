import { DrawHelper } from './DrawHelper';

export class Clade {
    _id!: string;
    name!: string;
    parentClade!: string;
    taxonomyLevel?: string;
    description?: string;
    isFirst!: boolean;
    drawHelper?: DrawHelper;
    tier!: number;
    directSons!: string[];
}
