import { render, screen } from '../utils/test-utils';
import { HeroSection } from '@/components/hero-section';

describe('App Integration Tests', () => {
  it('renders the hero section without crashing', () => {
    render(<HeroSection />);

    // Check if main content is rendered
    expect(screen.getByText('Artur Basak')).toBeInTheDocument();
  });

  it('renders hero section content', () => {
    render(<HeroSection />);

    // Check for main content
    expect(screen.getByText('Senior Frontend Engineer • UI/UX Specialist')).toBeInTheDocument();
  });

  it('renders social media links', () => {
    render(<HeroSection />);

    // Check for social media links
    expect(screen.getByLabelText('GitHub Profile')).toBeInTheDocument();
    expect(screen.getByLabelText('LinkedIn Profile')).toBeInTheDocument();
    expect(screen.getByLabelText('Telegram')).toBeInTheDocument();
  });
});
