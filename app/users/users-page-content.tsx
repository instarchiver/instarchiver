"use client";

import { Suspense, useCallback, useMemo } from "react";
import { UsersThree } from "@phosphor-icons/react";
import { useInfiniteUsers } from "@/hooks/use-users";
import { useDebouncedSearchParam } from "@/components/hooks/use-debounced-search-param";
import { useSearchParamState } from "@/components/hooks/use-search-param-state";
import { InfiniteGrid } from "@/components/ui/infinite-grid";
import { COLUMNS_2_3_4 } from "@/components/ui/grid-columns";
import { SearchInput } from "@/components/ui/search-input";
import { CardSkeletonGrid, Skeleton } from "@/components/ui/skeleton";
import { AddUserButton } from "@/components/users/add-user-dialog";
import { UserCard } from "@/components/users/user-card";
import {
  DEFAULT_USER_ORDERING,
  UserSortSelect,
} from "@/components/users/user-sort-select";
import type { InstagramUser } from "@/lib/api/types";

function UsersPageHeader() {
  return (
    <>
      <h1 className="text-2xl font-semibold text-foreground">Users</h1>
      <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted-foreground">
        Browse and sort archived Instagram profiles by followers, recency, or
        username, or open any profile to inspect its posts, stories, and
        snapshot history.
      </p>
    </>
  );
}

function UsersPageFallback({ allowAddUser }: { allowAddUser: boolean }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <UsersPageHeader />
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Skeleton className="h-11 w-full sm:max-w-sm sm:flex-1" />
        <Skeleton className="h-11 w-full sm:w-44" />
        {allowAddUser && (
          <Skeleton className="h-11 w-full sm:ml-auto sm:w-28" />
        )}
      </div>
      <div className="mt-8">
        <CardSkeletonGrid count={8} columns={COLUMNS_2_3_4} variant="user" />
      </div>
    </div>
  );
}

function UsersList({ allowAddUser }: { allowAddUser: boolean }) {
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

  const cleanHandle = trimmedSearch.replace(/^@/, "");
  const isSingleHandle =
    cleanHandle.length > 0 && !/\s/.test(cleanHandle) && cleanHandle.length <= 30;

  const emptyAction = isSearching ? (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => setSearch("")}
        className="flex min-h-11 cursor-pointer items-center rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        Clear search
      </button>
      {allowAddUser && (
        <AddUserButton
          initialUsername={isSingleHandle ? cleanHandle : undefined}
          label={isSingleHandle ? `Add @${cleanHandle}` : "Add user"}
        />
      )}
    </div>
  ) : allowAddUser ? (
    <AddUserButton />
  ) : undefined;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <UsersPageHeader />

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
        {allowAddUser && (
          <AddUserButton className="w-full justify-center sm:ml-auto sm:w-auto" />
        )}
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
              ? `No results for "${trimmedSearch}". Try a different username or name.`
              : undefined
          }
          emptyAction={emptyAction}
          errorMessage="Couldn't load archived users."
          columns={COLUMNS_2_3_4}
          cardAspectRatio={1.1}
          skeletonVariant="user"
          scrollKey={scrollKey}
        />
      </div>
    </div>
  );
}

export function UsersPageContent({
  allowAddUser,
}: {
  allowAddUser: boolean;
}) {
  return (
    <Suspense fallback={<UsersPageFallback allowAddUser={allowAddUser} />}>
      <UsersList allowAddUser={allowAddUser} />
    </Suspense>
  );
}
