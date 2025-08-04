import mongoose, { Schema } from 'mongoose';

export const SpeciesShcema = new Schema(
    {
        binomialNomenclature: { type: String, required: true, unique: true },
        genus: { type: String, required: true },
        commonName: { type: String }
    },
    {
        timestamps: true
    }
);

export const SpeciesModel = mongoose.model('species', SpeciesShcema);
