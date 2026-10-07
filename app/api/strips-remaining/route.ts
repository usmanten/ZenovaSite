import { NextResponse } from "next/server"
import { getStripsInventory } from "@/lib/strips-inventory"

export async function GET() {
    const { remaining } = await getStripsInventory()

    return NextResponse.json(
        { remaining },
        { headers: { "Cache-Control": "no-store" } }
    )
}
