import mongooseToJson from '@meanie/mongoose-to-json';
import { Document, Model, Mongoose, Schema } from 'mongoose';
import ServiceContainer from '../services/service-container';
import Attributes from './model';
import { UserInstance } from './user-model';

/**
 * Journey attributes.
 */
 export interface JourneyAttributes extends Attributes {
  owner: UserInstance;
  public: boolean;
  destinations: DestinationAttributes[];
}

/**
 * Journey instance.
 */
export interface JourneyInstance extends JourneyAttributes, Document {}

/**
 * Destination attributes.
 */
export interface DestinationAttributes {
  city: string;
  lat: number;
  lon: number;
  images: ImageAttributes[];
}

/**
 * Image attributes.
 */
export interface ImageAttributes {
  url: string;
}

/**
 * Creates the journey model.
 * 
 * @param container Services container
 * @param mongoose Mongoose instance
 */
export default function createSchema(container: ServiceContainer, mongoose: Mongoose): Model<JourneyInstance> {
  return mongoose.model('Journey', createJourneySchema(), 'journeys');
}

/**
 * Creates the journey schema.
 * 
 * @returns Journey schema
 */
function createJourneySchema() {
  const schema = new Schema({
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner is required']
    },
    public: {
      type: Schema.Types.Boolean,
      default: false
    },
    destinations: {
      type: [{
        type: createDestinationSchema(),
        default: []
      }]
    }
  }, {
    timestamps: true,
  });
  schema.plugin(mongooseToJson);
  return schema;
}

/**
 * Creates the destination subschema.
 * 
 * @returns Destination subschema
 */
function createDestinationSchema() {
  const schema = new Schema({
    city: {
      type: Schema.Types.String,
      required: [true, 'Destination city is required']
    },
    lat: {
      type: Schema.Types.Number,
      required: [true, 'Destination latitude is required']
    },
    lon: {
      type: Schema.Types.Number,
      required: [true, 'Destination longitude is required']
    },
    images: {
      type: [{
        type: createImageSchema(),
        default: []
      }]
    }
  }, {
    timestamps: false
  });
  schema.plugin(mongooseToJson);
  return schema;
}

/**
 * Creates the image subschema.
 * 
 * @returns Image subschema
 */
function createImageSchema() {
  const schema = new Schema({
    url: {
      type: Schema.Types.String,
      required: [true, 'Image URL is required']
    }
  }, {
    timestamps: false,
    _id: false
  });
  return schema;
}
