"use client";

import { Suspense, useCallback, useMemo } from "react";
import { UsersThree } from "@phosphor-icons/react";
import { useInfiniteUsers } from "@/hooks/use-users";
import { useDebouncedSearchParam } from "@/components/hooks/use-debounced-search-param";
import { useSearchParamState } from "@/components/hooks/use-search-param-state";
import { InfiniteGrid } from "@/components/ui/infinite-grid";
import { COLUMNS_2_3_4 } from "@/components/ui/grid-columns";
import { SearchInput } from "@/components/ui/search-input";
import { AddUserButton } from "@/components/users/add-user-dialog";
import { UserCard } from "@/components/users/user-card";
import {
  DEFAULT_USER_ORDERING,
  UserSortSelect,
} from "@/components/users/user-sort-select";
import type { InstagramUser } from "@/lib/api/types";

function UsersPageFallback() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold text-foreground">Users</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Every archived Instagram profile.
      </p>
      <div className="mt-8">
        <div className="min-h-11 animate-pulse rounded-lg border border-input bg-card" />
      </div>
    </div>
  );
}

function UsersList() {
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

  const users = useMemo(
    () => data?.pages.flatMap((page) => page.results) ?? [],
    [data?.pages]
  );
  const trimmedSearch = debouncedSearch.trim();
  const isSearching = trimmedSearch.length > 0;
  const scrollKey = `/users?q=${trimmedSearch}&ordering=${ordering}`;

  const getKey = useCallback((user: InstagramUser) => user.uuid, []);
  const renderItem = useCallback(
    (user: InstagramUser) => <UserCard user={user} />,
    []
  );
  const handleRetry = useCallback(() => {
    void refetch();
  }, [refetch]);

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
        <AddUserButton className="w-full justify-center sm:ml-auto sm:w-auto" />
      </div>

      <div className="mt-8">
        <InfiniteGrid
          items={users}
          getKey={getKey}
          renderItem={renderItem}
          hasNextPage={Boolean(hasNextPage)}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
          isLoading={isLoading}
          isError={isError}
          onRetry={handleRetry}
          emptyIcon={UsersThree}
          emptyTitle={
            isSearching ? "No users match your search" : "No users archived yet"
          }
          emptyDescription={
            isSearching
              ? `No results for "${debouncedSearch}". Try a different username or name.`
              : undefined
          }
          columns={COLUMNS_2_3_4}
          scrollKey={scrollKey}
        />
      </div>
    </div>
  );
}

export function UsersPageContent() {
  return (
    <Suspense fallback={<UsersPageFallback />}>
      <UsersList />
    </Suspense>
  );
}
