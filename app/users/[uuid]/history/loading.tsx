import { TimelineSkeleton } from "./user-history-content";

export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <TimelineSkeleton />
    </div>
  );
}
