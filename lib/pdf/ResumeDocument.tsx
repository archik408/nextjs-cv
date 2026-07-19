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
    fontSize: 14,
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    color: '#0f172a',
    flexDirection: 'row',
  },
  // Left Column (Sidebar)
  leftColumn: {
    width: '35%',
    backgroundColor: '#f8fafc',
    padding: 20,
    marginRight: 20,
  },
  // Right Column (Main Content)
  rightColumn: {
    width: '65%',
    padding: 0,
  },
  // Header Section
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  name: {
    fontSize: 22,
    fontWeight: 700,
    color: '#bb37d5',
    textAlign: 'left',
    marginBottom: 5,
  },
  role: {
    fontSize: 16,
    fontWeight: 500,
    color: '#957bef',
    textAlign: 'left',
  },
  // Contact Section
  contactSection: {
    marginBottom: 20,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: '#8f459f',
    marginBottom: 10,
    textAlign: 'left',
  },
  contactItem: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 5,
    textAlign: 'left',
  },
  link: {
    fontSize: 12,
    color: '#3b82f6',
    textDecoration: 'none',
  },
  // Skills Section
  skillsSection: {
    marginBottom: 20,
  },
  skillsTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: '#8f459f',
    marginBottom: 10,
    textAlign: 'left',
  },
  skillCategory: {
    marginBottom: 8,
  },
  skillCategoryTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: '#957bef',
    marginBottom: 3,
  },
  skillList: {
    fontSize: 11,
    color: '#64748b',
    lineHeight: 1.3,
  },
  // Main Content Styles
  sectionTitle: {
    fontSize: 16,
    fontWeight: 700,
    marginTop: 20,
    marginBottom: 8,
    color: '#8f459f',
    borderBottom: '2px solid #e2e8f0',
    paddingBottom: 3,
  },
  paragraph: {
    lineHeight: 1.4,
    fontSize: 12,
    marginBottom: 8,
  },
  // Experience Section
  expCard: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottom: '1px solid #f1f5f9',
  },
  expHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  expRole: {
    color: '#957bef',
    fontWeight: 600,
    fontSize: 13,
  },
  expRoleTail: {
    color: '#957bef',
    fontWeight: 400,
    fontSize: 12,
  },
  expPeriod: {
    fontSize: 11,
    color: '#64748b',
  },
  expCompany: {
    fontWeight: 600,
    fontSize: 12,
    marginBottom: 4,
  },
  listItem: {
    marginLeft: 8,
    fontSize: 11,
    lineHeight: 1.3,
    marginBottom: 2,
  },
  // Certificates Section
  certItem: {
    fontSize: 11,
    lineHeight: 1.3,
    marginBottom: 4,
  },
  // Footer
  footer: {
    fontSize: 10,
    marginTop: 20,
    color: '#94a3b8',
    textAlign: 'center',
    borderTop: '1px solid #e2e8f0',
    paddingTop: 10,
  },
});

type Props = {
  lang: ELanguage;
};

export function ResumeDocument({ lang }: Props) {
  const t = translations[lang] as (typeof translations)[ELanguage.en];
  const isRu = lang === ELanguage.ru;

  const labels = isRu
    ? {
        contact: 'Контакты',
        skills: 'Технические навыки',
        uiFrontend: 'UI / Frontend',
        backendTools: 'Backend и инструменты',
        designUx: 'Design & UX',
        testingQuality: 'Тестирование и качество',
        publications: 'Публикации',
        garden: 'Цифровой сад',
        frontEndCert: 'Professional Front-End Web Developer — W3Cx 2019',
        uxCert: 'Professional Google UX Design — Coursera 2025',
        a11yCert: 'Web Accessibility — W3Cx WAI0.1x 2021',
        footerPrefix: 'CV сгенерировано автоматически на',
      }
    : {
        contact: 'Contact',
        skills: 'Technical Skills',
        uiFrontend: 'UI / Frontend',
        backendTools: 'Backend & Tools',
        designUx: 'Design & UX',
        testingQuality: 'Testing & Quality',
        publications: 'Publications',
        garden: 'Digital Garden',
        frontEndCert: 'Professional Front-End Web Developer — W3Cx 2019',
        uxCert: 'Professional Google UX Design — Coursera 2025',
        a11yCert: 'Web Accessibility — W3Cx WAI0.1x 2021',
        footerPrefix: 'CV was generated automatically by',
      };

  const contacts = [
    { label: 'GitHub', href: 'https://github.com/archik408' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/arturbasak' },
    { label: 'Telegram', href: 'https://t.me/arturbasak' },
    { label: 'Email', href: 'mailto:artur.basak.devingrodno@gmail.com' },
    { label: labels.publications, href: 'https://arturbasak.dev/blog' },
    { label: labels.garden, href: 'https://arturbasak.dev/garden' },
  ];

  return (
    <Document author="Artur Basak" title={`Artur Basak – Resume (${lang})`}>
      <Page size="A4" style={styles.page}>
        {/* Left Column - Sidebar */}
        <View style={styles.leftColumn}>
          {/* Header with Avatar */}
          <View style={styles.header}>
            <Image
              style={styles.avatar}
              src="https://arturbasak.dev/avatar.jpeg"
              // @ts-expect-error
              alt="Artur Basak"
            />
            <Text style={styles.name}>Artur Basak</Text>
            <Text style={styles.role}>{t.roleMobile || t.role}</Text>
          </View>

          {/* Contact Information */}
          <View style={styles.contactSection}>
            <Text style={styles.contactTitle}>{labels.contact}</Text>
            {contacts.map((c, i) => (
              <Text key={i} style={styles.contactItem}>
                <Link src={c.href} style={styles.link}>
                  {c.label}
                </Link>
              </Text>
            ))}
          </View>

          {/* Skills */}
          <View style={styles.skillsSection}>
            <Text style={styles.skillsTitle}>{labels.skills}</Text>

            <View style={styles.skillCategory}>
              <Text style={styles.skillCategoryTitle}>{labels.uiFrontend}</Text>
              <Text style={styles.skillList}>
                JavaScript, HTML5, CSS3, PWA, React, Next.js, TypeScript, Lit/Web Components,
                Tailwind CSS, Material UI
              </Text>
            </View>

            <View style={styles.skillCategory}>
              <Text style={styles.skillCategoryTitle}>{labels.backendTools}</Text>
              <Text style={styles.skillList}>
                Node.js, Express, MongoDB, PostgreSQL, Git, Webpack, Vite, Turbopack, CI/CD,
                WASM/Rust, Headless CMS, Bun, Deno
              </Text>
            </View>

            <View style={styles.skillCategory}>
              <Text style={styles.skillCategoryTitle}>{labels.designUx}</Text>
              <Text style={styles.skillList}>
                UI/UX Design, Web Accessibility (WCAG), Figma, Design Systems, Mobile-First,
                Offline-First, Optimistic UI
              </Text>
            </View>

            <View style={styles.skillCategory}>
              <Text style={styles.skillCategoryTitle}>{labels.testingQuality}</Text>
              <Text style={styles.skillList}>
                Jest, React Testing Library, Cypress, Playwright, Web Performance, Core Web Vitals,
                Web Security (OWASP)
              </Text>
            </View>
          </View>
        </View>

        {/* Right Column - Main Content */}
        <View style={styles.rightColumn}>
          {/* About Section */}
          <Text style={styles.sectionTitle}>{t.about}</Text>
          <Text style={styles.paragraph}>
            {(t.resumeAbout || t.aboutText).replace(/<[^>]*>/g, '')}
          </Text>

          {/* Experience Section */}
          <Text style={styles.sectionTitle}>{t.experience}</Text>
          {t.experiences
            .filter((exp) => !('includeInResume' in exp) || exp.includeInResume !== false)
            .map((exp, idx) => {
              const [mainRole, tail] = exp.role.split('<small>');

              return (
                <View key={idx} style={styles.expCard} wrap>
                  <View style={styles.expHeader}>
                    <Text style={styles.expRole}>{mainRole}</Text>
                    <Text style={styles.expPeriod}>{exp.period}</Text>
                  </View>
                  {tail ? (
                    <Text style={styles.expRoleTail}>{tail.replace('</small>', '')}</Text>
                  ) : null}
                  <Text style={styles.expCompany}>{exp.company}</Text>
                  {(exp.listDescription || []).map((line: string, li: number) => (
                    <Text key={li} style={styles.listItem}>{`• ${line}`}</Text>
                  ))}
                </View>
              );
            })}

          {/* Certificates Section */}
          <Text style={styles.sectionTitle}>{t.certificates}</Text>
          <Text style={styles.certItem}>
            {t.diploma} — {t.college}
          </Text>
          <Text style={styles.certItem}>{labels.frontEndCert}</Text>
          <Text style={styles.certItem}>{labels.uxCert}</Text>
          <Text style={styles.certItem}>{labels.a11yCert}</Text>

          {/* Footer */}
          <Text style={styles.footer}>
            {labels.footerPrefix}{' '}
            <Link src="https://arturbasak.dev" style={styles.link}>
              https://arturbasak.dev
            </Link>
          </Text>
        </View>
      </Page>
    </Document>
  );
}
