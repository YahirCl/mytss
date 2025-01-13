import { prisma } from "@/libs/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {


    const result = await prisma.user.create({
        where: {id: 1}
    })

    return NextResponse.json(result);
}