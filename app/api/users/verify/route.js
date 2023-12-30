import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request) {
    try {
    const { token, id } = await request.json();
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });
        
    if (!user) {
        return NextResponse.json(
                {
                  data: null,
                  message: "User not found",
                },
                { status: 404 }
              );
    }

    const updatedUser = await db.user.update({
        where: {
            id,
        },
        data: {
            emailVerified: true
        }
    })
        
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Failed update User",
        error,
      },
      { status: 500 }
    );
  }
}
