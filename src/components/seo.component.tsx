export function SEO({ title }: { title: string }) {
    return (
      <div
        x-data={`seo("${title}")`}
      />
    );
}