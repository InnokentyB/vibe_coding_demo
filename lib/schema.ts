import { z } from 'zod';

export const RequestStatusEnum = z.enum(['pending', 'approved', 'rejected']);
export const UrgencyEnum = z.enum(['low', 'medium', 'high']);

export const EquipmentRequestSchema = z.object({
    id: z.string().uuid().optional(),
    title: z.string().min(1, 'Title is required').max(100),
    description: z.string().min(1, 'Description is required').max(1000),
    price: z.number().positive('Price must be greater than 0'),
    urgency: UrgencyEnum.default('low'),
    status: RequestStatusEnum.default('pending'),
    createdAt: z.string().datetime().optional(),
});

export type EquipmentRequest = z.infer<typeof EquipmentRequestSchema>;
export type EquipmentRequestCreate = Omit<EquipmentRequest, 'id' | 'createdAt' | 'status'>;
