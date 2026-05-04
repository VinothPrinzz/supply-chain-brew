import React, { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Printer } from "lucide-react";

interface ReportViewerProps {
  title: string;
  pages: React.ReactNode[];
  className?: string;
}

const ReportViewer: React.FC<ReportViewerProps> = ({ title, pages, className }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalPages = pages.length;

  const goToPrev = () => setCurrentPage((p) => Math.max(0, p - 1));
  const goToNext = () => setCurrentPage((p) => Math.min(totalPages - 1, p + 1));

  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  const handlePrint = () => {
    window.print();
  };

  if (totalPages === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No report data to display. Select filters and generate the report.
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`flex flex-col ${isFullscreen ? "bg-background p-4" : ""} ${className || ""}`}>
      {/* Toolbar */}
      <div className="no-print flex items-center justify-between border-b bg-card px-4 py-2 rounded-t-md">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToPrev} disabled={currentPage === 0}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground min-w-[100px] text-center">
            Page {currentPage + 1} of {totalPages}
          </span>
          <Button variant="outline" size="sm" onClick={goToNext} disabled={currentPage === totalPages - 1}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <div className="w-px h-6 bg-border mx-1" />
          <Button variant="outline" size="sm" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Report Content - A4 style. Page can widen past A4 if the table overflows. */}
      <div className="flex-1 overflow-auto bg-muted/30 p-4">
        <div className="mx-auto w-fit">
          <div className="legacy-report bg-white shadow-md border rounded-sm min-w-[210mm] min-h-[297mm] p-6 text-foreground inline-block align-top">
            {pages[currentPage]}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportViewer;
