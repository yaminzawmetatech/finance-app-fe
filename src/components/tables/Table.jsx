import { useMemo } from "react";
import { MaterialReactTable } from "material-react-table";
import {
  Box,
  Button,
  ListItemIcon,
  MenuItem,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const Table = ({
  columns,
  data = [],
  isLoading = false,
  onCreate,
  onEdit,
  onDelete,
  createButtonLabel = "Create New",
  enableCreateButton = true,
  enableRowActions = true,
  initialState = {},
  state: controlledState = {},
  ...tableProps
}) => {
  const tableInitialState = useMemo(
    () => ({
      density: "compact",
      showGlobalFilter: true,
      ...initialState,
    }),
    [initialState]
  );

  return (
    <Box sx={{ width: "100%" }}>
      <MaterialReactTable
        columns={columns}
        data={data}
        initialState={tableInitialState}
        state={{
          isLoading,
          ...controlledState,
        }}
        enableStickyHeader
        enableColumnOrdering
        enableColumnResizing
        enablePinning
        enableRowActions={enableRowActions}
        positionActionsColumn="last"
        columnResizeMode="onChange"
        muiTableContainerProps={{
          sx: {
            maxHeight: "calc(100vh - 250px)",
          },
        }}
        renderRowActionMenuItems={({ row }) => [
          ...(onEdit
            ? [
                <MenuItem
                  key="edit"
                  onClick={() => onEdit(row)}
                >
                  <ListItemIcon>
                    <Edit fontSize="small" />
                  </ListItemIcon>
                  Edit
                </MenuItem>,
              ]
            : []),

          ...(onDelete
            ? [
                <MenuItem
                  key="delete"
                  onClick={() => onDelete(row)}
                >
                  <ListItemIcon>
                    <Delete fontSize="small" />
                  </ListItemIcon>
                  Delete
                </MenuItem>,
              ]
            : []),
        ]}
        renderTopToolbarCustomActions={() =>
          enableCreateButton ? (
            <Button
              variant="contained"
              onClick={onCreate}
              disabled={!onCreate}
            >
              {createButtonLabel}
            </Button>
          ) : null
        }
        {...tableProps}
      />
    </Box>
  );
};

export default Table;