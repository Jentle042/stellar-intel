import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Metadata } from 'next';
import Link from 'next/link';
import { marked } from 'marked';
import { PROSE_CLASSES } from '@/lib/prose';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://stellar-intel.vercel.app';
const TITLE = 'Methodology — Stellar Intel';
const DESCRIPTION =
  'Understand how Stellar Intel evaluates anchor reputation, corridor performance, and recent outcomes.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    type: 'website',
    title: TITLE,
    description: DESCRIPTION,
    url: new URL('/methodology', SITE_URL).toString(),
    images: [
      {
        url: new URL('/opengraph-image', SITE_URL).toString(),
        width: 1200,
        height: 630,
        alt: 'Stellar Intel — a public health record for Stellar off-ramp anchors',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
};

// Renders docs/ANCHOR_REPUTATION.md directly rather than duplicating its
// content in this component, so the doc stays the single source of truth —
// editing it is the only way to update this page.
function renderMethodologyDoc(): string {
  const source = readFileSync(join(process.cwd(), 'docs/ANCHOR_REPUTATION.md'), 'utf-8');
  return marked.parse(source, { async: false });
}

// Shared with /terms so both markdown-rendered pages look identical.
export default function MethodologyPage() {
  const html = renderMethodologyDoc();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className={PROSE_CLASSES} dangerouslySetInnerHTML={{ __html: html }} />
      <section aria-labelledby="quotes-estimates-heading" className={PROSE_CLASSES}>
        <h2 id="quotes-estimates-heading">Quotes, estimates and what actually lands</h2>
        <p>
          Firm quotes follow SEP-38 and are binding for a stated window. Indicative quotes are
          informational only and are not a commitment to deliver the stated amount.
        </p>
        <p>
          The reference price is computed by the recipe described in Q38017. The realized rate is
          measured as <code>amount_out / amount_in</code> (Q38001), so it reflects what the
          recipient actually received rather than what was quoted.
        </p>
        <p>
          Quote-gap statistics compare quoted and landed amounts over a fixed trailing window
          (Q38003). The min-receive guard rejects transactions whose landed amount falls below the
          quoted minimum, allowing a tolerance defined by <code>MIN_RECEIVE_TOLERANCE</code>{' '}
          (Q38007).
        </p>
        <p>
          Anchors that return firm SEP-38 quotes receive a ranking bonus, surfaced by a flag
          (Q38011). Readiness for SEP-38 is summarized at{' '}
          <Link href="/anchors/sep38">/anchors/sep38</Link> and{' '}
          <a href="/api/v1/sep38/readiness">/api/v1/sep38/readiness</a>.
        </p>
        <p>
          SEP-38 readiness describes whether an anchor can serve a <strong>firm</strong> quote (a
          quote with a binding price and expiry) for a given corridor, as opposed to an indicative
          rate derived from fees and FX. Readiness is computed from the anchor&apos;s{' '}
          <code>stellar.toml</code> (<code>ANCHOR_QUOTE_SERVER</code> presence), the{' '}
          <code>/info</code> assets and corridors the quote server advertises, and the outcome of
          live probes recorded in the capability capture.
        </p>
        <p>
          Anchors that are not SEP-38 ready fall back to the indicative tiers described above
          (SEP-24, then SEP-6). Indicative and firm rates are never mixed in the same comparison
          without the badge making the distinction visible.
        </p>
      </section>
    </div>
  );
}
