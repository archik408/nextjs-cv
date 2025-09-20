import { render, screen } from '../utils/test-utils';
import { ArticleTitle } from '@/components/article-title';

describe('ArticleTitle', () => {
  it('renders the title text correctly', () => {
    render(<ArticleTitle text="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('applies small variant styles when small prop is true', () => {
    render(<ArticleTitle text="Small Title" small />);
    const title = screen.getByText('Small Title');
    expect(title).toHaveClass('text-lg', 'md:text-xl', 'font-bold', 'mb-4');
  });

  it('applies default styles when small prop is false', () => {
    render(<ArticleTitle text="Default Title" />);
    const title = screen.getByText('Default Title');
    expect(title).toHaveClass('text-4xl', 'md:text-5xl', 'font-bold', 'mb-4');
  });

  it('renders with correct heading level', () => {
    render(<ArticleTitle text="Heading Title" />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Heading Title');
  });

  it('applies gradient text styles', () => {
    render(<ArticleTitle text="Gradient Title" />);
    const title = screen.getByText('Gradient Title');
    expect(title).toHaveStyle(
      'background-image: linear-gradient(-90deg,rgb(176, 194, 218) 0, #007cb1 30%, #55389e 50%, #752884 70%, #4e1f5b 90%, #492530 100%)'
    );
  });
});
