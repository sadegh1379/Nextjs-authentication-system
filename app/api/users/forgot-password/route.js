import db from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import base64url from "base64url";
import { EmailTemplate } from '../../../../components/email-template'
import { Resend } from 'resend';

export async function PUT(request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { email } = await request.json();
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (!existingUser) {
      return NextResponse.json(
        {
          data: null,
          message: `User Not Found`,
        },
        { status: 404 }
      );
    }

    // generage a token
    const rawToken = uuidv4();

    // token
    const token = base64url.encode(rawToken);

    const updatedUser = await db.user.update({
        where: {
            email,
          },
        data: {
            passwordResetToken: token
        },
    });
    
    // send email with token to user for verification
    const name = existingUser.name
    const userId = existingUser.id
    const redirectUrl = `reset-password?token=${token}&id=${userId}`
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      // to: ['akbarisadegh382@gmail.com'],
      to: email,
      subject: 'Account Reset Password',
      react: EmailTemplate({
        redirectUrl,
        username: name,
        title: 'Reset Password',
        description: "Thanks you, for reset password an account with Us. we request you to onClick on the link  below in order to reset password.",
        linkText: 'Reset Password'
      }),
    });
  
    return NextResponse.json(
      {
        data: null,
        message: "User Updated Successfully",
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
