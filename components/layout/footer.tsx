export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          InstArchiver &mdash; an archive browser for Instagram users, stories,
          and posts.
        </p>
        <a
          href="mailto:arter@instarchiver.net"
          className="transition-colors hover:text-foreground"
        >
          arter@instarchiver.net
        </a>
      </div>
    </footer>
  );
}
