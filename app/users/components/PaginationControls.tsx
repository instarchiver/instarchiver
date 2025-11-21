'use client';

import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface PaginationControlsProps {
  currentPage?: number; // Optional for cursor-based pagination
  totalPages?: number; // Optional for cursor-based pagination
  hasPrevious: boolean;
  hasNext: boolean;
  onPrevPage: () => void;
  onNextPage: () => void;
  goToPage?: (page: number) => void; // Optional function for direct navigation
}

export function PaginationControls({
  currentPage,
  totalPages,
  hasPrevious,
  hasNext,
  onPrevPage,
  onNextPage,
  goToPage,
}: PaginationControlsProps) {
  // Generate page numbers array to handle dynamic pagination
  const getPageNumbers = (): (number | string)[] => {
    // Type guard: return empty array if required values are missing
    if (!currentPage || !totalPages) return [];

    const pages: (number | string)[] = [];
    const maxVisiblePages = 5; // Max visible numbered pages

    // Always add page 1
    pages.push(1);

    // Determine start and end pages around current page
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    // Adjust when near the beginning
    if (currentPage <= 3) {
      endPage = Math.min(totalPages - 1, maxVisiblePages - 1);
    }

    // Adjust when near the end
    if (currentPage >= totalPages - 2) {
      startPage = Math.max(2, totalPages - maxVisiblePages + 1);
    }

    // Add ellipsis if there's a gap after page 1
    if (startPage > 2) {
      pages.push('start-ellipsis');
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      if (i > 1 && i < totalPages) {
        pages.push(i);
      }
    }

    // Add ellipsis if there's a gap before the last page
    if (endPage < totalPages - 1 && totalPages > 1) {
      pages.push('end-ellipsis');
    }

    // Add last page if there is more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  // Function to navigate to a specific page
  const handlePageClick = (targetPage: number) => {
    // Type guard: do nothing if currentPage is not defined
    if (!currentPage || targetPage === currentPage) return;

    if (goToPage) {
      // Use the direct navigation if provided
      goToPage(targetPage);
    } else {
      // Fallback to sequential navigation
      if (targetPage < currentPage) {
        // If going backwards, call onPrevPage multiple times
        for (let i = 0; i < currentPage - targetPage; i++) {
          onPrevPage();
        }
      } else {
        // If going forwards, call onNextPage multiple times
        for (let i = 0; i < targetPage - currentPage; i++) {
          onNextPage();
        }
      }
    }
  };

  // Get the array of page numbers to display (only if using page-based pagination)
  const pageNumbers = currentPage && totalPages ? getPageNumbers() : [];
  const isCursorBased = !currentPage || !totalPages;

  return (
    <Pagination className="mt-12">
      <PaginationContent className="flex-wrap gap-2">
        {/* Previous button always visible */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={e => {
              e.preventDefault();
              if (hasPrevious) onPrevPage();
            }}
            aria-disabled={!hasPrevious}
            className={!hasPrevious ? 'opacity-50 pointer-events-none' : ''}
          />
        </PaginationItem>

        {/* Page numbers - only shown for page-based pagination */}
        {!isCursorBased && (
          <>
            {/* Mobile view: Only show current page indicator */}
            <PaginationItem className="sm:hidden">
              <PaginationLink
                href="#"
                isActive={true}
                onClick={e => e.preventDefault()}
                className="px-6"
              >
                {currentPage}/{totalPages}
              </PaginationLink>
            </PaginationItem>

            {/* Desktop view: Show full pagination */}
            {pageNumbers.map((page, index) => {
              if (page === 'start-ellipsis' || page === 'end-ellipsis') {
                return (
                  <PaginationItem key={`ellipsis-${index}`} className="hidden sm:flex">
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }

              const pageNum = page as number;
              // Important pages: first, last, current and adjacent
              const isImportantPage =
                pageNum === 1 ||
                pageNum === totalPages ||
                Math.abs(pageNum - (currentPage || 1)) <= 1;

              // On smallest screens, only show current page
              // On small screens, show important pages
              // On medium and up, show all calculated pages
              const visibilityClass = isImportantPage ? 'hidden sm:flex' : 'hidden md:flex';

              return (
                <PaginationItem key={`page-${pageNum}`} className={visibilityClass}>
                  <PaginationLink
                    href="#"
                    onClick={e => {
                      e.preventDefault();
                      handlePageClick(pageNum);
                    }}
                    isActive={currentPage === pageNum}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
          </>
        )}

        {/* Next button always visible */}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={e => {
              e.preventDefault();
              if (hasNext) onNextPage();
            }}
            aria-disabled={!hasNext}
            className={!hasNext ? 'opacity-50 pointer-events-none' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export default PaginationControls;
