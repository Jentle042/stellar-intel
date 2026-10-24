import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import MethodologyPage from '@/app/methodology/page';

describe('Methodology page — quotes and estimates (#1517)', () => {
  it('renders the quotes, estimates and what actually lands heading', () => {
    const { getByRole } = render(<MethodologyPage />);

    expect(
      getByRole('heading', { level: 2, name: 'Quotes, estimates and what actually lands' })
    ).toBeDefined();
  });

  it('does not invent constants or endpoints that are not on main', () => {
    const { container } = render(<MethodologyPage />);
    const text = container.textContent ?? '';

    expect(text).not.toContain('/api/v1/sep38/readiness');
    expect(text).not.toContain('/anchors/sep38');
  });
});
