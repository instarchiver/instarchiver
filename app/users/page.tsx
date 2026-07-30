"use client";

import { Suspense } from "react";
import { UsersThree } from "@phosphor-icons/react";
import { useInfiniteUsers } from "@/hooks/use-users";
import { useDebouncedSearchParam } from "@/components/hooks/use-debounced-search-param";
import { useSearchParamState } from "@/components/hooks/use-search-param-state";
import { InfiniteGrid } from "@/components/ui/infinite-grid";
import { SearchInput } from "@/components/ui/search-input";
import { UserCard } from "@/components/users/user-card";
import {
  DEFAULT_USER_ORDERING,
  UserSortSelect,
} from "@/components/users/user-sort-select";

function UsersPageFallback() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold text-foreground">Users</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Every archived Instagram profile.
      </p>
      <div className="mt-8">
        <div className="min-h-11 animate-pulse rounded-lg border border-border bg-card" />
      </div>
    </div>
  );
}

function UsersPageContent() {
  const { value: search, debouncedValue: debouncedSearch, setValue: setSearch } =
    useDebouncedSearchParam("q");
  const { value: ordering, setValue: setOrdering } = useSearchParamState(
    "ordering",
    DEFAULT_USER_ORDERING
  );
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteUsers(debouncedSearch, ordering);

  const users = data?.pages.flatMap((page) => page.results) ?? [];
  const isSearching = debouncedSearch.trim().length > 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold text-foreground">Users</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Every archived Instagram profile.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="sm:max-w-sm sm:flex-1">
          <SearchInput
            value={search}
            onChange={setSearch}
            onClear={() => setSearch("")}
            placeholder="Search users..."
            aria-label="Search users"
          />
        </div>
        <UserSortSelect value={ordering} onChange={setOrdering} />
      </div>

      <div className="mt-8">
        <InfiniteGrid
          items={users}
          getKey={(user) => user.uuid}
          renderItem={(user) => <UserCard user={user} />}
          hasNextPage={Boolean(hasNextPage)}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
          emptyIcon={UsersThree}
          emptyTitle={
            isSearching ? "No users match your search" : "No users archived yet"
          }
          emptyDescription={
            isSearching
              ? `No results for "${debouncedSearch}". Try a different username or name.`
              : undefined
          }
          columnsClassName="grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
        />
      </div>
    </div>
  );
}

export default function UsersPage() {
  return (
    <Suspense fallback={<UsersPageFallback />}>
      <UsersPageContent />
    </Suspense>
  );
}
