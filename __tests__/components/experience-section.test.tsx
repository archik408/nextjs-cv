import { render, screen } from '../utils/test-utils';
import { ExperienceSection } from '@/components/experience-section';

describe('ExperienceSection', () => {
  it('renders the experience section with correct title', () => {
    render(<ExperienceSection />);

    expect(screen.getByRole('heading', { name: 'Experience' })).toBeInTheDocument();
  });

  it('renders timeline link', () => {
    render(<ExperienceSection />);

    const timelineLink = screen.getByRole('link', { name: /Timeline/i });
    expect(timelineLink).toBeInTheDocument();
    expect(timelineLink).toHaveAttribute('href', '/timeline');
  });

  it('limits roles and shows view-all link when configured', () => {
    render(<ExperienceSection limit={3} showViewAllLink />);

    expect(screen.getByText('X5 Tech')).toBeInTheDocument();
    expect(screen.getByText('IntexSoft')).toBeInTheDocument();
    expect(screen.getByText('Godel Technologies')).toBeInTheDocument();
    expect(screen.queryByText('Indy')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /View full experience/i })).toHaveAttribute(
      'href',
      '/experience'
    );
  });

  it('renders a static page heading without requiring animation', () => {
    render(<ExperienceSection animateTitle={false} titleAs="h1" />);

    expect(screen.getByRole('heading', { level: 1, name: 'Experience' })).toBeInTheDocument();
  });
});
