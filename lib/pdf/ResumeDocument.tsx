import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import { translations } from '@/lib/translations';
import { ELanguage } from '@/constants/enums';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 11,
    paddingTop: 28,
    paddingBottom: 28,
    paddingHorizontal: 28,
    color: '#0f172a',
  },
  header: {
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: 700,
  },
  role: {
    fontSize: 12,
    color: '#334155',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  link: {
    color: '#1d4ed8',
    textDecoration: 'none',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    marginTop: 16,
    marginBottom: 6,
    color: '#111827',
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
    fontWeight: 700,
  },
  expCompany: {
    color: '#1d4ed8',
  },
  listItem: {
    marginLeft: 10,
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
  ];

  return (
    <Document author="Artur Basak" title={`Artur Basak – Resume (${lang})`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>Artur Basak</Text>
          <Text style={styles.role}>{t.role}</Text>
          <View style={styles.row}>
            {contacts.map((c, i) => (
              <Link key={i} src={c.href} style={styles.link}>
                {c.label}
              </Link>
            ))}
          </View>
          <View style={styles.row}>
            <Link src="https://arturbasak.dev" style={styles.link}>
              https://arturbasak.dev
            </Link>
          </View>
        </View>

        <Text style={styles.sectionTitle}>{t.about}</Text>
        <Text style={styles.paragraph}>
          {/* Strip tags from aboutText */}
          {t.aboutText.replace(/<[^>]*>/g, ' ')}
        </Text>

        <Text style={styles.sectionTitle}>{t.skills}</Text>
        <Text style={styles.paragraph}>
          {/* Summarized skills – keep concise for one-page */}
          JavaScript, TypeScript, Node.js, React, Next.js, Design Systems, UX, Web Accessibility
          (WCAG), Performance, PWA, HTTPS/REST, QA & Automated Testing
          (Jest/RTL/Cypress/Playwright), Webpack, Vite, CI/CD
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
        <Text style={styles.paragraph}>UX Design — Google 2021 - 2025</Text>
      </Page>
    </Document>
  );
}
