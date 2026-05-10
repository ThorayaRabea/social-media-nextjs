import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(req: NextRequest) {
    const body = await req.json()
    const token = req.headers.get('token') || ''

    const res = await fetch(
        'https://route-posts.routemisr.com/users/change-password',
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                token,
            },
            body: JSON.stringify(body),
        }
    )

    const data = await res.json()
    return NextResponse.json(data)
}