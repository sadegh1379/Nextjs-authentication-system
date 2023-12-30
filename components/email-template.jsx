import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

export const EmailTemplate = ({
  username = "",
  redirectUrl = "login",
  title = "",
  description = "",
  linkText = ""
}) => (
  <Html>
    <Head />
    <Preview>
      A fine-grained personal access token has been added to your account
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`${baseUrl}/static/sadegh.jpg`}
          width="32"
          height="32"
          alt="auth system"
          style={image}
        />
        <Text style={title}>
          {title}
        </Text>

        <Section style={section}>
          <Text style={text}>
            Hey <strong>{username}</strong>!
          </Text>
          <Text style={text}>
            {description}
          </Text>
          {linkText ? (
            <Button href={`${baseUrl}/${redirectUrl}`} style={button}>{linkText}</Button>
          ) : null}
        </Section>
        <Text style={links}>
          <Link style={link}>Your security audit log</Link> ・{' '}
          <Link style={link}>Contact support</Link>
        </Text>

        <Text style={footer}>
          Auth system by s.akbari, Inc. ・88 Colin P Kelly Jr Street ・San Francisco, CA 94107
        </Text>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: '#ffffff',
  color: '#24292e',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
};

const container = {
  width: '480px',
  margin: '0 auto',
  padding: '20px 0 48px',
};

const title = {
  fontSize: '24px',
  lineHeight: 1.25,
};

const section = {
  padding: '24px',
  border: 'solid 1px #dedede',
  borderRadius: '5px',
  textAlign: 'center',
};

const text = {
  margin: '0 0 10px 0',
  textAlign: 'left',
};

const button = {
  fontSize: '14px',
  backgroundColor: '#28a745',
  color: '#fff',
  lineHeight: 1.5,
  borderRadius: '0.5em',
  padding: '0.75em 1.5em',
};

const links = {
  textAlign: 'center',
};

const link = {
  color: '#0366d6',
  fontSize: '12px',
};

const footer = {
  color: '#6a737d',
  fontSize: '12px',
  textAlign: 'center',
  marginTop: '60px',
};

const image = {
  width: '100px',
  height: '100px',
  borderRadius: '50px',
  margin: '0 auto'
}