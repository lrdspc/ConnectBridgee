import React, { ReactNode } from 'react';

interface SmartTableProps {
  children: ReactNode;
  className?: string;
}

export const SmartTable: React.FC<SmartTableProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`smart-table-container ${className}`}>
      <table className="smart-table">
        {children}
      </table>
    </div>
  );
};

interface SmartTableHeadProps {
  children: ReactNode;
  className?: string;
}

export const SmartTableHead: React.FC<SmartTableHeadProps> = ({
  children,
  className = ''
}) => {
  return (
    <thead className={`smart-table-head ${className}`}>
      {children}
    </thead>
  );
};

interface SmartTableBodyProps {
  children: ReactNode;
  className?: string;
}

export const SmartTableBody: React.FC<SmartTableBodyProps> = ({
  children,
  className = ''
}) => {
  return (
    <tbody className={`smart-table-body ${className}`}>
      {children}
    </tbody>
  );
};

interface SmartTableRowProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const SmartTableRow: React.FC<SmartTableRowProps> = ({
  children,
  className = '',
  onClick
}) => {
  return (
    <tr 
      className={`smart-table-row ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </tr>
  );
};

interface SmartTableCellProps {
  children: ReactNode;
  className?: string;
  as?: 'td' | 'th';
}

export const SmartTableCell: React.FC<SmartTableCellProps> = ({
  children,
  className = '',
  as = 'td'
}) => {
  if (as === 'th') {
    return (
      <th className={`smart-table-cell ${className}`}>
        {children}
      </th>
    );
  }
  
  return (
    <td className={`smart-table-cell ${className}`}>
      {children}
    </td>
  );
};

interface SmartListProps {
  children: ReactNode;
  className?: string;
}

export const SmartList: React.FC<SmartListProps> = ({
  children,
  className = ''
}) => {
  return (
    <ul className={`smart-list ${className}`}>
      {children}
    </ul>
  );
};

interface SmartListItemProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const SmartListItem: React.FC<SmartListItemProps> = ({
  children,
  className = '',
  onClick
}) => {
  return (
    <li 
      className={`smart-list-item ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </li>
  );
};