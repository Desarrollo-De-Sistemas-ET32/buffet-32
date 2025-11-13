import React from 'react';
import { Skeleton } from '../ui/skeleton';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/table';

interface SkeletonTableProps {
  columns?: number;
  rows?: number;
}

const SkeletonTable: React.FC<SkeletonTableProps> = ({ columns = 5, rows = 6 }) => {
  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            {Array.from({ length: columns }).map((_, colIdx) => (
              <TableHead
                key={colIdx}
                className={
                  "px-4 py-2" + (colIdx === columns - 1 ? " text-right flex justify-end" : "")
                }
              >
                <Skeleton className="h-4 w-24" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <TableRow key={rowIdx}>
              {Array.from({ length: columns }).map((_, colIdx) => (
                <TableCell
                  key={colIdx}
                  className={
                    "px-4 py-2" + (colIdx === columns - 1 ? " text-right" : "")
                  }
                >
                  {colIdx === columns - 1 ? (
                    <div className="flex gap-2 justify-end">
                      <Skeleton className="h-8 w-8 rounded-md" />
                      <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                  ) : (
                    <Skeleton className="h-4 w-32" />
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SkeletonTable;