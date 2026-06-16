import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export type RequestStatus = 'Pending' | 'Approved' | 'Rejected';

export interface IRequest extends Document {
  user: Types.ObjectId;
  requestedRole: 'Manager';
  status: RequestStatus;
  currentRole: string;
  flagged: boolean;
}

const requestSchema = new Schema<IRequest>(
  {
    user:          { type: Schema.Types.ObjectId, ref: 'User', required: true },
    requestedRole: { type: String, enum: ['Manager'], default: 'Manager' },
    status:        { type: String, enum: ['Pending', 'Approved', 'Rejected'] as RequestStatus[], default: 'Pending' },
    currentRole:   { type: String, default: 'User' },
    flagged:       { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Request: Model<IRequest> = mongoose.model<IRequest>('Request', requestSchema);
export default Request;
