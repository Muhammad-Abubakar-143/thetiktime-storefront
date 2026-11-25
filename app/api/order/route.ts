import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const hostingerUrl = 'https://zesty-rosybrown-curlew-26.hostingersite.com/api/index.php?route=order';
    const origin = 'https://thetiktime-storefront.vercel.app';

    const response = await fetch(hostingerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': origin,
      },
      body: JSON.stringify(body),
    });

    const responseText = await response.text();
    let data: unknown;
    try {
      data = JSON.parse(responseText);
    } catch {
      console.error('Hostinger order API returned a non-JSON response:', response.status);
      return NextResponse.json(
        { error: 'Hostinger order API returned an invalid response.' },
        { status: 502 }
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        data,
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Order API route error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to process order', details: errorMessage },
      { status: 500 }
    );
  }
}



