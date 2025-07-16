import { useEffect, useRef, RefObject, useCallback } from "react";

export function useInfiniteScrollUp({
  containerRef,
  canLoadMore,
  loading,
  onLoadMore,
  threshold = 16,
}: {
  containerRef: RefObject<HTMLDivElement | null>;
  canLoadMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
  threshold?: number;
}) {
  const topMarkerRef = useRef<HTMLDivElement>(null);
  const isTriggerArmed = useRef(true);

  const scrollAnchor = useRef<{
    element: HTMLElement;
    offsetTop: number;
    scrollTop: number;
  } | null>(null);

  const captureScrollPosition = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const messageElements = container.querySelectorAll("[data-message-id]");
    if (messageElements.length === 0) return;

    for (const element of messageElements) {
      const rect = element.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      if (rect.top >= containerRect.top && rect.top <= containerRect.bottom) {
        scrollAnchor.current = {
          element: element as HTMLElement,
          offsetTop: rect.top - containerRect.top,
          scrollTop: container.scrollTop,
        };
        break;
      }
    }
  }, [containerRef]);

  const restoreScrollPosition = useCallback(() => {
    const container = containerRef.current;
    const anchor = scrollAnchor.current;

    if (!container || !anchor) return;

    requestAnimationFrame(() => {
      const rect = anchor.element.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const currentOffset = rect.top - containerRect.top;

      const scrollDiff = currentOffset - anchor.offsetTop;
      container.scrollTop = container.scrollTop + scrollDiff;

      scrollAnchor.current = null;
    });
  }, [containerRef]);

  const handleLoadMore = useCallback(() => {
    if (loading || !canLoadMore) return;

    captureScrollPosition();
    onLoadMore();
  }, [loading, canLoadMore, captureScrollPosition, onLoadMore]);

  useEffect(() => {
    if (!loading && scrollAnchor.current) {
      restoreScrollPosition();
    }
  }, [loading, restoreScrollPosition]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;

      if (scrollTop > threshold) {
        isTriggerArmed.current = true;
        return;
      }
      if (
        isTriggerArmed.current &&
        scrollTop <= threshold &&
        !loading &&
        canLoadMore
      ) {
        isTriggerArmed.current = false;
        handleLoadMore();
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [containerRef, canLoadMore, loading, handleLoadMore, threshold]);

  return topMarkerRef;
}
