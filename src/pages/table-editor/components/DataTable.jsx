import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const DataTable = ({ 
  data, 
  columns, 
  visibleColumns, 
  selectedRows, 
  onRowSelect, 
  onRowEdit, 
  onRowDelete, 
  onRowClone,
  onCellEdit,
  sortConfig,
  onSort,
  editingCell,
  setEditingCell 
}) => {
  const [editValue, setEditValue] = useState('');

  const handleSort = (columnKey) => {
    let direction = 'asc';
    if (sortConfig?.key === columnKey && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    onSort({ key: columnKey, direction });
  };

  const handleCellClick = (rowId, columnKey, currentValue) => {
    setEditingCell({ rowId, columnKey });
    setEditValue(currentValue || '');
  };

  const handleCellSave = () => {
    if (editingCell) {
      onCellEdit(editingCell?.rowId, editingCell?.columnKey, editValue);
      setEditingCell(null);
      setEditValue('');
    }
  };

  const handleCellCancel = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter') {
      handleCellSave();
    } else if (e?.key === 'Escape') {
      handleCellCancel();
    }
  };

  const visibleColumnData = columns?.filter(col => visibleColumns?.includes(col?.key));

  const getSortIcon = (columnKey) => {
    if (sortConfig?.key !== columnKey) {
      return <Icon name="ArrowUpDown" size={14} className="text-muted-foreground" />;
    }
    return sortConfig?.direction === 'asc' 
      ? <Icon name="ArrowUp" size={14} className="text-primary" />
      : <Icon name="ArrowDown" size={14} className="text-primary" />;
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="w-12 p-4">
                <span className="sr-only">Select</span>
              </th>
              {visibleColumnData?.map((column) => (
                <th key={column?.key} className="text-left p-4">
                  <button
                    onClick={() => handleSort(column?.key)}
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth"
                  >
                    {column?.label}
                    {getSortIcon(column?.key)}
                  </button>
                </th>
              ))}
              <th className="w-32 p-4">
                <span className="text-sm font-medium text-muted-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.map((row, index) => (
              <tr key={row?.id} className="border-b border-border hover:bg-muted/50 transition-smooth">
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedRows?.includes(row?.id)}
                    onChange={() => onRowSelect(row?.id)}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
                  />
                </td>
                {visibleColumnData?.map((column) => (
                  <td key={column?.key} className="p-4">
                    {editingCell?.rowId === row?.id && editingCell?.columnKey === column?.key ? (
                      <div className="flex items-center gap-2">
                        <Input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e?.target?.value)}
                          onKeyDown={handleKeyPress}
                          className="text-sm"
                          autoFocus
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleCellSave}
                          iconName="Check"
                          iconSize={14}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleCellCancel}
                          iconName="X"
                          iconSize={14}
                        />
                      </div>
                    ) : (
                      <div
                        onClick={() => handleCellClick(row?.id, column?.key, row?.[column?.key])}
                        className="text-sm text-foreground cursor-pointer hover:bg-muted/50 p-1 rounded transition-smooth min-h-[24px]"
                      >
                        {row?.[column?.key] || '-'}
                      </div>
                    )}
                  </td>
                ))}
                <td className="p-4">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRowEdit(row?.id)}
                      iconName="Edit2"
                      iconSize={14}
                      className="h-8 w-8"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRowClone(row?.id)}
                      iconName="Copy"
                      iconSize={14}
                      className="h-8 w-8"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRowDelete(row?.id)}
                      iconName="Trash2"
                      iconSize={14}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Card View */}
      <div className="lg:hidden">
        {data?.map((row) => (
          <div key={row?.id} className="border-b border-border p-4">
            <div className="flex items-center justify-between mb-3">
              <input
                type="checkbox"
                checked={selectedRows?.includes(row?.id)}
                onChange={() => onRowSelect(row?.id)}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
              />
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRowEdit(row?.id)}
                  iconName="Edit2"
                  iconSize={16}
                  className="h-8 w-8"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRowClone(row?.id)}
                  iconName="Copy"
                  iconSize={16}
                  className="h-8 w-8"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRowDelete(row?.id)}
                  iconName="Trash2"
                  iconSize={16}
                  className="h-8 w-8 text-destructive hover:text-destructive"
                />
              </div>
            </div>
            <div className="space-y-2">
              {visibleColumnData?.map((column) => (
                <div key={column?.key} className="flex justify-between items-start">
                  <span className="text-sm font-medium text-muted-foreground min-w-0 flex-1">
                    {column?.label}:
                  </span>
                  <span className="text-sm text-foreground ml-2 flex-1 text-right">
                    {row?.[column?.key] || '-'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Empty State */}
      {data?.length === 0 && (
        <div className="p-12 text-center">
          <Icon name="Table" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No data found</h3>
          <p className="text-sm text-muted-foreground">
            No rows match your current search criteria or the table is empty.
          </p>
        </div>
      )}
    </div>
  );
};

export default DataTable;