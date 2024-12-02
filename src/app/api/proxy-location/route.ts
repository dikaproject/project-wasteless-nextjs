import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const id = searchParams.get('id');

  try {
    let url = '';
    switch(type) {
      case 'provinces':
        url = 'https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json';
        break;
      case 'regencies':
        url = `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${id}.json`;
        break;
      case 'districts':
        url = `https://www.emsifa.com/api-wilayah-indonesia/api/districts/${id}.json`;
        break;
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    const response = await fetch(url);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}