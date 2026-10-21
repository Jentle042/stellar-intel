import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Metadata } from 'next';
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
// content in this component, so the dod stays the single source of truth —
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
      <div className={PROSE_CLASSES} dangerouslySetInnerHTML={{ __html: htm }} />
      <section aria-labelledby="quotes-estimates-landed" className="mt-12">
        <h2
          id="quotes-estimates-landed"
          className="text-2xl font-semibold tracking-tight text-slate-900"
        >
          Quotes, estimates and what actually lands
        </h2>
        <p className="mt-4 text-sm text-slate-700">
          This section explains the SEP-38 work around that backs the quote and realized-rate
          signals on anchor pages. It covers how firm quotes differ from indicative estimates, how
          the reference price is built, how the realized rate is measured, how quote-gap stats are
          windowed, how the min-receive guard decides, and how firm quotes affect ranking.
        </p>
        <h3 id="firm-vs-indicative" className="mt-6 text-lg font-semibold text-slate-900">
          Firm (SEP-38) vs indicative
        </h3>
        <p className="mt-2 text-sm text-slate-700">
          A <strong>firm</strong> quote is a SEP-38 quote that an anchor commits to for a bounded
          window, with an expiry time and a stated price. An
          <strong>indicative</strong> quote is a non-binding estimate that may move before the
          transfer actually settles. We treat the two differently: firm quotes feed the quote-gap
          stats and the ranking bonus, while indicative quotes only inform the reference estimate.
        </p>
        <h3 id="reference-price-recipe" className="mt-6 text-lg font-semibold text-slate-900">
          The reference price recipe (Q38017)
        </h3>
        <p className="mt-2 text-sm text-slate-700">
          The reference estimate is assembled from the anchor’s own quotes and the corridor context
          around the sample. It is not a market price claim; it is a baseline that lets us compare
          quoted prices to what actually landed.
        </p>
        <h3 id="realized-rate-basis" className="mt-6 text-lg font-semibold text-slate-900">
          The realized-rate basis (Q38001)
        </h3>
        <p className="mt-2 text-sm text-slate-700">
          The realized rate is computed as <code>amount_out / amount_in</code>
          from the actual settled transfer, not from the quoted price. This is the “quoted vs
          landed” comparison: the quote is what the anchor said, the realized rate is what the user
          actually got.
        </p>
        <h3 id="quote-gap-stats" className="mt-6 text-lg font-semibold text-slate-900">
          Quote-gap stats and their window (Q38003)
        </h3>
        <p className="mt-2 text-sm text-slate-700">
          Quote-gap stats compare the quoted price to the realized rate across a fixed window of
          recent filled Q38003 samples. The window is defined in the merged code and is used
          consistently across the anchor pages and the public API.
        </p>
        <h3 id="min-receive-guard" className="mt-6 text-lg font-semibold text-slate-900">
          The min-receive guard and MIN_RECEIVE_TOLERANCE (Q38007)
        </h3>
        <p className="mt-2 text-sm text-slate-700">
          The min-receive guard flags a quote when the realized amount falls below the anchor’s
          stated minimum receive amount, allowing for a<code>MIN_RECEIVE_TOLERANCE</code> buffer.
          The constant value is the one shipped in the merged code; it is not restated here as a
          magic number.
        </p>
        <h3 id="firm-quote-ranking-bonus" className="mt-6 text-lg font-semibold text-slate-900">
          The firm-quote ranking bonus and its flag (Q38011)
        </h3>
        <p className="mt-2 text-sm text-slate-700">
          Anchors that provide firm SEP-38 quotes receive a small ranking bonus, controlled by a
          feature flag. The bonus is visible in the ranking breakdown and is only applied when the
          flag is enabled in the merged code.
        </p>
      </section>
    </div>
  );
}
