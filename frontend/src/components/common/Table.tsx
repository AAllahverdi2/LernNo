import React from 'react';
import { clsx } from 'clsx';

export const Table: React.FC<React.TableHTMLAttributes<HTMLTableElement>> = ({ children, className, ...props }) => (
  <div className="w-full overflow-x-auto rounded-2xl border border-slate-800">
    <table className={clsx('w-full text-left border-collapse text-sm', className)} {...props}>
      {children}
    </table>
  </div>
);

export const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ children, className, ...props }) => (
  <thead className={clsx('bg-slate-950/80 text-xs font-semibold uppercase text-slate-400 border-b border-slate-800', className)} {...props}>
    {children}
  </thead>
);

export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ children, className, ...props }) => (
  <tbody className={clsx('divide-y divide-slate-800/60 bg-slate-900/50', className)} {...props}>
    {children}
  </tbody>
);

export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({ children, className, ...props }) => (
  <tr className={clsx('hover:bg-slate-800/40 transition-colors', className)} {...props}>
    {children}
  </tr>
);

export const TableHead: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({ children, className, ...props }) => (
  <th className={clsx('px-6 py-4 font-semibold tracking-wider text-slate-300', className)} {...props}>
    {children}
  </th>
);

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({ children, className, ...props }) => (
  <td className={clsx('px-6 py-4 text-slate-200 align-middle', className)} {...props}>
    {children}
  </td>
);
