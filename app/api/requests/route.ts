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
        const supabase = getDb();
        const { data: rows, error } = await supabase
            .from('requests')
            .select('*')
            .order('createdAt', { ascending: false });

        if (error) {
            console.error('[API GET /api/requests] Supabase error:', error);
            return NextResponse.json({ error: 'Database Error' }, { status: 500 });
        }

        console.log(`[API GET /api/requests] Successfully retrieved ${rows?.length || 0} requests.`);
        return NextResponse.json(rows);
    } catch (error) {
        console.error('[API GET /api/requests] Unexpected error:', error);
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
        const supabase = getDb();
        const id = crypto.randomUUID();
        const createdAt = new Date().toISOString();
        const status = 'pending';

        const { error } = await supabase
            .from('requests')
            .insert([{ id, title, description, price, urgency, status, createdAt }]);

        if (error) {
            console.error('[API POST /api/requests] Supabase insert error:', error);
            return NextResponse.json({ error: 'Database Insert Error' }, { status: 500 });
        }

        console.log(`[API POST /api/requests] Successfully created request ${id}.`);

        return NextResponse.json({ id, title, description, price, urgency, status, createdAt }, { status: 201 });
    } catch (error) {
        console.error('[API POST /api/requests] Unexpected error processing request:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
