import prisma from "@lib/prisma";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Request) {
  const { email, password, username } = await req.json();
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (user) {
    return NextResponse.json({ error: "ユーザーは登録されています" }, { status: 400 });
  } else {
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: await hash(password, 10),
      },
    });
    return NextResponse.json(user);
  }
}
