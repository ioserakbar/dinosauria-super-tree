import { Schema, model } from 'mongoose';

export interface Clade {
    id: string;
    name: string;
    parentClade: string;
    description: string;
    isFirst?: boolean;
    drawHelper?: {
        coords: {
            angle: number;
            distance: number;
        };
        totalSons: number;
        arcOrientation: boolean;
    };
    tier?: number;
    directSons?: string[];
}

export const cladeSchema = new Schema<Clade>(
    {
        name: { type: String, required: true },
        parentClade: { type: String, required: false },
        description: { type: String },
        isFirst: { type: Boolean, required: true },
        drawHelper: {
            coords: {
                angle: { type: Number },
                distance: { type: Number }
            },
            totalSons: { type: Number },
            arcOrientation: { type: Boolean }
        },
        tier: { type: Number, required: true },
        directSons: { type: [String], required: false }
    },
    {
        toJSON: {
            virtuals: true
        },
        toObject: {
            virtuals: true
        },
        timestamps: true
    }
);

export const CladeModel = model<Clade>('clades', cladeSchema);
