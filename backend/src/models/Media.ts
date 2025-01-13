import mongoose, { Schema, Document } from 'mongoose';

interface IMedia extends Document {
  id: string;
  user?: (string | mongoose.Types.ObjectId) | null;
  updatedAt: string;
  createdAt: string;
  url?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
  sizes?: {
    thumbnail?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      mimeType?: string | null;
      filesize?: number | null;
      filename?: string | null;
    };
    card?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      mimeType?: string | null;
      filesize?: number | null;
      filename?: string | null;
    };
    tablet?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      mimeType?: string | null;
      filesize?: number | null;
      filename?: string | null;
    };
  };
}

const mediaSchema: Schema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    transform: (doc: any, ret: any) => ret
  },
  updatedAt: {
    type: Date,
    updatedAt: true
  },
  createdAt: {
    type: Date,
    createdAt: true
  },
  url: {
    type: String
  },
  filename: {
    type: String
  },
  mimeType: {
    type: String
  },
  filesize: {
    type: Number
  },
  width: {
    type: Number
  },
  height: {
    type: Number
  },
  sizes: {
    thumbnail: {
      url: {
        type: String
      },
      width: {
        type: Number
      },
      height: {
        type: Number
      },
      mimeType: {
        type: String
      },
      filesize: {
        type: Number
      },
      filename: {
        type: String
      }
    },
    card: {
      url: {
        type: String
      },
      width: {
        type: Number
      },
      height: {
        type: Number
      },
      mimeType: {
        type: String
      },
      filesize: {
        type: Number
      },
      filename: {
        type: String
      }
    },
    tablet: {
      url: {
        type: String
      },
      width: {
        type: Number
      },
      height: {
        type: Number
      },
      mimeType: {
        type: String
      },
      filesize: {
        type: Number
      },
      filename: {
        type: String
      }
    }
  }
});

const MediaModel = mongoose.model<IMedia>('Media', mediaSchema);
export default MediaModel;
