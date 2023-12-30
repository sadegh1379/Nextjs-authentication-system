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
    const { password, id } = await request.json();
    const existingUser = await db.user.findUnique({
      where: {
        id,
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
    
    if (!existingUser.passwordResetToken) {
        return NextResponse.json(
          {
            data: null,
            message: `User Reset link has been expired. Please try again`,
          },
          { status: 401 }
        );
      }
      
    // Encrypt the Password =>bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);
      
    const updatedUser = await db.user.update({
        where: {
            id,
          },
        data: {
            password,
            hashedPassword,
            passwordResetToken: null,
        },
    });
    
    // send email with token to user for verification
    const name = existingUser.name
    const userId = existingUser.id
    const email = existingUser.email
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      // to: ['akbarisadegh382@gmail.com'],
      to: email,
      subject: 'Your Account password has been updated',
      react: EmailTemplate({
        username: name,
        title: 'Your Acount password changed ',
        description: "your account password changed with email",
      }),
    });
  
    return NextResponse.json(
      {
        data: null,
        message: "User Password updated Successfully",
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
