import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { EquipmentRequestSchema } from '@/lib/schema';
import crypto from 'crypto';

/**
 * GET handler to retrieve all equipment purchase requests.
 * @returns {Promise<NextResponse>} JSON response containing the array of requests.
 */
export async function GET() {
    console.log('[API GET /api/requests] Retrieving all requests...');
    try {
        const db = getDb();
        const rows = db.prepare('SELECT * FROM requests ORDER BY createdAt DESC').all();
        console.log(`[API GET /api/requests] Successfully retrieved ${rows.length} requests.`);
        return NextResponse.json(rows);
    } catch (error) {
        console.error('[API GET /api/requests] Database error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

/**
 * POST handler to create a new equipment purchase request.
 * @param {Request} request - The incoming HTTP request containing the purchase details.
 * @returns {Promise<NextResponse>} JSON response indicating success or providing validation/server errors.
 */
export async function POST(request: Request) {
    console.log('[API POST /api/requests] Attempting to create a new request...');
    try {
        const body = await request.json();
        console.log('[API POST /api/requests] Received body:', JSON.stringify(body));

        const result = EquipmentRequestSchema.safeParse(body);

        if (!result.success) {
            console.warn('[API POST /api/requests] Validation failed:', result.error.format());
            return NextResponse.json(
                { error: 'Validation failed', details: result.error.format() },
                { status: 400 }
            );
        }

        const { title, description, price, urgency } = result.data;
        const db = getDb();
        const id = crypto.randomUUID();
        const createdAt = new Date().toISOString();
        const status = 'pending';

        const insertReq = db.prepare(
            'INSERT INTO requests (id, title, description, price, urgency, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)'
        );

        insertReq.run(id, title, description, price, urgency, status, createdAt);
        console.log(`[API POST /api/requests] Successfully created request ${id}.`);

        return NextResponse.json({ id, title, description, price, urgency, status, createdAt }, { status: 201 });
    } catch (error) {
        console.error('[API POST /api/requests] Error processing request:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
