import { Request, Response } from 'express';
import * as requestService from '../services/requestService';
import { Types } from 'mongoose';
import { RequestStatus } from '../models/Request';
import { IUser } from '../models/User';

interface AppError extends Error {
  statusCode?: number;
}

interface AuthRequest extends Request {
  user?: IUser;
}

export const createRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const request = await requestService.createRequest(req.user!._id as Types.ObjectId);
    res.status(201).json(request);
  } catch (error) {
    const err = error as AppError;
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

export const getMyRequests = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const requests = await requestService.getMyRequests(req.user!._id as Types.ObjectId);
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getAllRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const requests = await requestService.getAllRequests();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateRequestStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const request = await requestService.updateRequestStatus(
      id,
      req.body.status as RequestStatus
    );
    res.json(request);
  } catch (error) {
    const err = error as AppError;
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};
