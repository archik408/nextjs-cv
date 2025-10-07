import { render, screen } from '../utils/test-utils';
import userEvent from '@testing-library/user-event';
import { HeroSection } from '@/components/hero-section';

describe('HeroSection', () => {
  it('renders the hero section with correct content', () => {
    render(<HeroSection />);

    expect(screen.getByText('Artur Basak')).toBeInTheDocument();
    expect(screen.getByText('Senior Frontend Engineer • UI/UX Specialist')).toBeInTheDocument();
  });

  it('renders social media links', () => {
    render(<HeroSection />);

    expect(screen.getByLabelText('GitHub Profile')).toBeInTheDocument();
    expect(screen.getByLabelText('LinkedIn Profile')).toBeInTheDocument();
    expect(screen.getByLabelText('Telegram')).toBeInTheDocument();
  });

  it('has correct href attributes for social links', () => {
    render(<HeroSection />);

    const githubLink = screen.getByLabelText('GitHub Profile');
    const linkedinLink = screen.getByLabelText('LinkedIn Profile');
    const telegramLink = screen.getByLabelText('Telegram');

    expect(githubLink).toHaveAttribute('href', 'https://github.com/archik408');
    expect(linkedinLink).toHaveAttribute('href', 'https://www.linkedin.com/in/arturbasak');
    expect(telegramLink).toHaveAttribute('href', 'https://t.me/arturbasak');
  });

  it('renders avatar image', () => {
    render(<HeroSection />);

    const avatars = screen.getAllByRole('img');
    const avatar = avatars.find((img) => img.getAttribute('alt') === 'Artur Basak');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', '/avatar.jpeg');
  });

  it('toggles avatar flip on click', async () => {
    const user = userEvent.setup();
    render(<HeroSection />);

    const avatarFlipCard = screen.getByRole('button', { name: 'Avatar flip card' });
    const avatars = screen.getAllByRole('img');
    const defaultAvatar = avatars.find((img) => img.getAttribute('alt') === 'Artur Basak');

    expect(defaultAvatar).toBeInTheDocument();

    await user.click(avatarFlipCard);

    expect(defaultAvatar).toBeInTheDocument();
  });
});
