import { render, screen } from '../utils/test-utils';
import { ExperienceSection } from '@/components/experience-section';

describe('ExperienceSection', () => {
  it('renders the experience section with correct title', () => {
    render(<ExperienceSection />);

    expect(screen.getByText('Experience')).toBeInTheDocument();
  });

  it('renders timeline link', () => {
    render(<ExperienceSection />);

    const timelineLink = screen.getByText('Timeline');
    expect(timelineLink).toBeInTheDocument();
    expect(timelineLink.closest('a')).toHaveAttribute('href', '/timeline');
  });
});
