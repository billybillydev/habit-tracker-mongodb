export function SEO({ title }: { title: string }) {
    return (
      <div
        x-data={`{ title: "${title}" }`}
        x-init={`
                if (document.title !== title) {
                    document.title = title;
                }
            `}
      />
    );
}