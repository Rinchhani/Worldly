import mongoose from 'mongoose';

const countrySchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    nativeName: {
      type: String,
      required: true,
    },
    region: {
      type: String,
      required: true,
    },
    flag: {
      type: String,
      required: true,
    },
    capital: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    subtitle: String,
    coordinates: String,
    radarCoords: {
      x: Number,
      y: Number,
    },
    population: String,
    popDelta: String,
    area: String,
    gdp: String,
    gdpRank: String,
    hdi: String,
    economy: {
      services: Number,
      industry: Number,
      agriculture: Number,
      exports: [String],
      partners: [
        {
          name: String,
          share: String,
        },
      ],
    },
    resources: [String],
    agriculture: [String],
    geography: {
      desc: String,
      peak: String,
      unesco: String,
      climate: String,
    },
    trivia: [
      {
        title: String,
        text: String,
      },
    ],
    comparisons: {
      popRaw: Number,
      gdpCap: String,
      gdpCapRaw: Number,
      cleanEnergy: String,
      cleanEnergyRaw: Number,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Country', countrySchema);

