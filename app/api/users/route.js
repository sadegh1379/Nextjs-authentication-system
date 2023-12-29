import db from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import base64url from "base64url";
import EmailTemplate from '../../../components/email-template'
import { Resend } from 'resend';

export async function POST(request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    //extract the credentials
    const { name, email, password, role } = await request.json();
    //Check if the user Already exists in the db
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      return NextResponse.json(
        {
          data: null,
          message: `User with this email ( ${email})  already exists in the Database`,
        },
        { status: 409 }
      );
    }
    // Encrypt the Password =>bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // generage a token
    const rawToken = uuidv4();

    // token
    const token = base64url.encode(rawToken);

    // send email with token to user for verification
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      // to: ['akbarisadegh382@gmail.com'],
      to: email,
      subject: 'Account verification Auth System',
      react: EmailTemplate({ token }),
    });

    console.log('token: ' + token);
    console.log('mail send: ' + data);

    // const newUser = await db.user.create({
    //   data: {
    //     name,
    //     email,
    //     password,
    //     hashedPassword,
    //     role,
    //     verificationToken: token
    //   },
    // });
    // console.log(newUser);
    return NextResponse.json(
      {
        data: null,
        message: "User Created Successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: "Server Error: Something went wrong",
      },
      { status: 500 }
    );
  }
}
export async function GET(request) {
  try {
    const users = await db.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Failed to Fetch Users",
        error,
      },
      { status: 500 }
    );
  }
}
