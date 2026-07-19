import { render, screen } from '../utils/test-utils';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { OtherCertificatesCarousel } from '@/components/other-certificates-carousel';
import { OTHER_CERTIFICATES } from '@/constants/other-certificates';

jest.mock('@/lib/hooks/use-animation-preferences', () => ({
  useAnimationPreferences: () => ({
    prefersReducedMotion: false,
    isLowEndDevice: false,
    isSlowConnection: false,
    shouldAnimate: true,
    detectionComplete: true,
  }),
}));

describe('OtherCertificatesCarousel', () => {
  it('renders the carousel label and certificate images with descriptive alts', () => {
    render(<OtherCertificatesCarousel onOpenCertificate={jest.fn()} />);

    expect(
      screen.getByText(
        /Other certificates from LinkedIn Learning, Coursera, Udemy, Frontend Masters/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByAltText(
        /Interviewing for Front-End Engineers from Frontend Masters, completed March 14, 2020/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByAltText(
        /Progressive Web Apps \(PWA\) — The Complete Guide, completed May 13, 2024/i
      )
    ).toBeInTheDocument();
  });

  it('exposes a pause control for autoplay and toggles to play', async () => {
    const user = userEvent.setup();
    render(<OtherCertificatesCarousel onOpenCertificate={jest.fn()} />);

    const pauseButton = screen.getByRole('button', { name: /Pause certificate carousel/i });
    expect(pauseButton).toHaveAttribute('aria-pressed', 'false');

    await user.click(pauseButton);

    expect(screen.getByRole('button', { name: /Play certificate carousel/i })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
  });

  it('opens a certificate when a thumbnail is activated', async () => {
    const user = userEvent.setup();
    const onOpenCertificate = jest.fn();
    render(<OtherCertificatesCarousel onOpenCertificate={onOpenCertificate} />);

    const firstCert = OTHER_CERTIFICATES[0];
    const image = screen.getByAltText(
      /Interviewing for Front-End Engineers from Frontend Masters, completed March 14, 2020/i
    );

    await user.click(image);

    expect(onOpenCertificate).toHaveBeenCalledWith(
      'Interviewing for Front-End Engineers — Frontend Masters',
      firstCert.src
    );
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<OtherCertificatesCarousel onOpenCertificate={jest.fn()} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
