import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link, Image, Font } from '@react-pdf/renderer';
import { translations } from '@/lib/translations';
import { ELanguage } from '@/constants/enums';

Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf',
      fontWeight: 500, // Semibold
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
      fontWeight: 700, // Bold
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Roboto',
    fontSize: 16,
    paddingTop: 28,
    paddingBottom: 28,
    paddingHorizontal: 28,
    color: '#0f172a',
  },
  avatar: {
    width: 80,
    height: 80,
    position: 'absolute',
    top: 28,
    right: 28,
    borderRadius: 40,
  },
  header: {
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: 700,
    color: '#bb37d5',
  },
  role: {
    fontSize: 20,
    fontWeight: 500,
    color: '#957bef',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  link: {
    fontSize: 12,
    color: 'rgb(92,114,168)',
    textDecoration: 'none',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 700,
    marginTop: 16,
    marginBottom: 6,
    color: '#8f459f',
  },
  expertise: {
    marginBottom: 8,
  },
  expertiseTitle: {
    color: '#957bef',
    fontWeight: 500,
    marginBottom: 4,
  },
  paragraph: {
    lineHeight: 1.4,
  },
  expCard: {
    marginBottom: 10,
  },
  expHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  expRole: {
    color: '#957bef',
    fontWeight: 700,
  },
  expCompany: {
    fontWeight: 600,
  },
  listItem: {
    marginLeft: 10,
  },
  footer: {
    fontSize: 11,
    marginTop: 32,
    color: '#334155',
  },
});

type Props = {
  lang: ELanguage;
};

export function ResumeDocument({ lang }: Props) {
  const t = translations[lang];

  const contacts = [
    { label: 'GitHub', href: 'https://github.com/archik408' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/arturbasak' },
    { label: 'Telegram', href: 'https://t.me/arturbasak' },
    { label: 'Email', href: 'mailto:artur.basak.devingrodno@gmail.com' },
    { label: 'Blog', href: 'https://arturbasak.dev/blog' },
    { label: 'Digital Garden', href: 'https://arturbasak.dev/garden' },
  ];

  return (
    <Document author="Artur Basak" title={`Artur Basak – Resume (${lang})`}>
      <Page size="A4" style={styles.page}>
        <Image
          style={styles.avatar}
          src="https://arturbasak.dev/avatar.jpeg"
          // @ts-expect-error
          alt="Artur Basak"
        />
        <View style={styles.header}>
          <Text style={styles.name}>Artur Basak</Text>
          <Text style={styles.role}>{t.role}</Text>
          <View style={styles.row}>
            {contacts.map((c, i) => (
              <Link key={i} src={c.href} style={styles.link}>
                {c.label}
                {i + 1 < contacts.length ? ' |' : ''}
              </Link>
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>{t.about}</Text>
        <Text style={styles.paragraph}>{t.aboutText.replace(/<[^>]*>/g, '')}</Text>

        <Text style={styles.sectionTitle}>{t.skills}</Text>
        {t.expertise.map((expertise) => (
          <View key={expertise.title} style={styles.expertise}>
            <Text style={styles.expertiseTitle}>{expertise.title}</Text>
            <Text style={styles.paragraph}>{expertise.description}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Skills</Text>
        <Text style={styles.paragraph}>
          {/* Summarized skills – keep concise for one-page */}
          HTML5, CSS, JavaScript, TypeScript, Node.js, React, MobX, Next.js (SSR/SSG/ISR), Design
          Systems, UI/UX Design, Web Accessibility (WCAG), Web Performance, Web Security (OWASP),
          PWA, HTTPS/REST, QA & Automated Testing (Jest/RTL/Cypress/Playwright), Web Components,
          Lit, FrontOps (Webpack, Vite, Turbopack, npm, yarn), CI/CD, Rust/WebAssembly, Workbox,
          Bootstrap, Tailwind CSS, Headless CMS (Strapi, Contentful, WordPress, Prismic),
          Micro-frontends, Material UI, Mobile-First, Offline-First, Bun, Deno, IndexedDB, MongoDB,
          PostgreSQL, MySQL, SQL/NoSQL, Angular.js, EmberJS, ExtJS, jQuery, Backbone.js
        </Text>

        <Text style={styles.sectionTitle}>{t.experience}</Text>
        {t.experiences.slice(0, 5).map((exp: any, idx: number) => (
          <View key={idx} style={styles.expCard} wrap>
            <View style={styles.expHeader}>
              <Text style={styles.expRole}>{exp.role}</Text>
              <Text>{exp.period}</Text>
            </View>
            <Text style={styles.expCompany}>{exp.company}</Text>
            {(exp.listDescription || []).slice(0, 5).map((line: string, li: number) => (
              <Text key={li} style={styles.listItem}>{`• ${line}`}</Text>
            ))}
          </View>
        ))}

        <Text style={styles.sectionTitle}>{t.certificates}</Text>
        <Text style={styles.paragraph}>
          {t.diploma} — {t.college}
        </Text>
        <Text style={styles.paragraph}>Professional Front-End Web Developer — W3Cx 2019</Text>
        <Text style={styles.paragraph}>Professional Google UX Design — Coursera 2025</Text>
        <Text style={styles.paragraph}>Web Accessibility — W3Cx WAI0.1x 2021</Text>
        <Text style={styles.footer}>
          CV was generated automatically by{' '}
          <Link src="https://arturbasak.dev" style={styles.link}>
            https://arturbasak.dev
          </Link>
        </Text>
      </Page>
    </Document>
  );
}
