import { useEffect, useRef, useState } from "react";
import { Spinner } from "react-bootstrap";

const InfiniteScrollComponent = ({ children, fetchMoreData, hasMore, loading, className }) => {
  const observer = useRef(null);
  const scrollContainerRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState("70vh"); // Default 80% tinggi layar

  // Update tinggi berdasarkan ukuran layar
  useEffect(() => {
    const updateMaxHeight = () => {
      const screenHeight = window.innerHeight;
      setMaxHeight(`${screenHeight * 0.70}px`); // 80% dari tinggi layar dalam pixel
    };

    updateMaxHeight();
    window.addEventListener("resize", updateMaxHeight);

    return () => {
      window.removeEventListener("resize", updateMaxHeight);
    };
  }, []);

  useEffect(() => {
    if (loading || !hasMore) return;

    const observerCallback = (entries) => {
      if (entries[0].isIntersecting) {
        // console.log("Trigger detected, fetching more data...");
        fetchMoreData();
      }
    };

    observer.current = new IntersectionObserver(observerCallback, {
      root: scrollContainerRef.current, // Mengamati scroll dalam container ini
      threshold: 1.0, // Aktif saat elemen sepenuhnya terlihat
    });

    const target = document.getElementById("loadMoreTrigger");
    if (target) observer.current.observe(target);

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [loading, hasMore, fetchMoreData]);

  return (
    <div ref={scrollContainerRef} className={className}>
      {children}

      {/* Elemen terakhir sebagai trigger infinite scroll */}
      {hasMore && <div id="loadMoreTrigger" style={{ height: "10px", background: "transparent" }} />}

      {/* Loading Spinner */}
      {loading && (
        <div className="text-center mt-2">
          <Spinner animation="border" variant="secondary" />
        </div>
      )}

      {!hasMore && <p className="text-center text-muted">No more data to load.</p>}
    </div>
  );
};

export default InfiniteScrollComponent;
