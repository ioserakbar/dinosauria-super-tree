import mongoose, { Schema } from 'mongoose';

export const cladeSchema = new Schema(
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

export const CladeModel = mongoose.model('clades', cladeSchema);
