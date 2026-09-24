import { Breadcrumbs, type Crumb } from "./PageHero";

/** Simple, readable layout for legal documents. */
export function LegalPage({
  crumbs,
  title,
  updated,
  children,
}: {
  crumbs: Crumb[];
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <section className="bg-ink pb-16 pt-[calc(var(--header-h)+3.5rem)] text-paper sm:pt-[calc(var(--header-h)+5rem)]">
        <div className="container-bs">
          <Breadcrumbs items={crumbs} />
          <h1 className="font-display-tight mt-10 text-[clamp(2.8rem,7vw,6rem)] font-semibold">{title}</h1>
          <p className="mt-6 text-sm text-paper/50">Last updated: {updated}</p>
        </div>
      </section>
      <section className="bg-paper py-16 text-ink sm:py-24">
        <div className="container-bs">
          <div className="prose-bs mx-auto max-w-3xl">{children}</div>
        </div>
      </section>
    </>
  );
}
