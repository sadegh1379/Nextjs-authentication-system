import db from "@/lib/db";
import { NextResponse } from "next/server";
import { Resend } from 'resend';
import { EmailTemplate } from "../../../../../components/email-template";

export async function POST(request, { params: { id } }) {
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });
    
    const { email, name, verificationToken } = user;
    // send email with token to user for verification
    const resend = new Resend(process.env.RESEND_API_KEY);
    const redirectUrl = `login?token=${verificationToken}&id=${id}`
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      // to: ['akbarisadegh382@gmail.com'],
      to: email,
      subject: 'Account verification Auth System',
      react: EmailTemplate({ redirectUrl, username: name }),
    });
      
      return NextResponse.json(
        {
            data: user,
            message: "Email send successfully",
          },
          { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Failed send email to User",
        error,
      },
      { status: 500 }
    );
  }
}
