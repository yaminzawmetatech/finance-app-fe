import * as React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import { getProjectCategory } from "features/projectcategory/projectcategorySlice";
import { getUserGroups } from "features/userGroup/userGroupSlice";
import { getTable } from "features/table/tableSlice";
import FormInputSelect from "components/form/FormInputSelect";
import FormInputText from "components/form/FormInputText";
import CommonMessage from "common/CommonMessage";

export const CreateApprovalWorkflowModal = ({
  open,
  onClose,
  columns,
  editValues,
  editFlag,
  control,
  handleSubmit,
  onSubmit,
  reset,
  setEditValues,
}) => {
  const dispatch = useDispatch();

  const { projectCategories, isError, isSuccess, isLoading, message } =
    useSelector((state) => state.projectCategories);

  const {
    userGroups,
    isError: isUserGroupsError,
    isSuccess: isUserGroupsSuccess,
    isLoading: isUserGroupsLoading,
    message: UserGroupsMessage,
  } = useSelector((state) => state.userGroups);

  const {
    table,
    isError: isTableError,
    isSuccess: isTableSuccess,
    isLoading: isTablesLoading,
    message: TablesMessage,
  } = useSelector((state) => state.table);

  useEffect(() => {
    if (open) {
      dispatch(getProjectCategory());
      dispatch(getUserGroups());
      dispatch(getTable());
    }
  }, [dispatch, open]);

  useEffect(() => {
    if (editFlag === false) {
      reset();
    }
  }, [editFlag, editValues, open, reset]);

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">
        {editFlag === true
          ? "Edit Approval Workflow"
          : "Create New Approval Workflow"}
      </DialogTitle>
      <DialogContent>
        <Stack
          sx={{
            width: "100%",
            minWidth: { xs: "300px", sm: "360px", md: "400px" },
            gap: "1.5rem",
            mt: 1,
            marginTop: "20px",
          }}
        >
          <FormInputSelect
            control={control}
            id="id"
            name="category_id"
            options={projectCategories}
            getOptionLabel={(option) => option?.name || ""}
            label={<span className="required">Category</span>}
            rules={{
              required: true,
            }}
          />
        </Stack>
        <Stack
          sx={{
            width: "100%",
            minWidth: { xs: "300px", sm: "360px", md: "400px" },
            gap: "1.5rem",
            mt: 1,
            marginTop: "20px",
          }}
        >
          <FormInputSelect
            control={control}
            id="id"
            name="user_group_id"
            options={userGroups}
            getOptionLabel={(option) => option?.name || ""}
            label={<span className="required">User Group</span>}
            rules={{
              required: true,
            }}
          />
        </Stack>
        <Stack
          sx={{
            width: "100%",
            minWidth: { xs: "300px", sm: "360px", md: "400px" },
            gap: "1.5rem",
            mt: 1,
            marginTop: "20px",
          }}
        >
          <FormInputSelect
            control={control}
            id="id"
            name="table_id"
            options={table}
            getOptionLabel={(option) => option?.name || ""}
            label={<span className="required">Table Name</span>}
            rules={{
              required: true,
            }}
          />
        </Stack>
        <Stack
          sx={{
            width: "100%",
            minWidth: { xs: "300px", sm: "360px", md: "400px" },
            gap: "1.5rem",
            mt: 1,
            marginTop: "20px",
          }}
        >
          {columns.map((column) => {
            const isExcludedKey =
              column.accessorKey === "category" ||
              column.accessorKey === "user_group" ||
              column.accessorKey === "table";

            const isRequired = column.accessorKey === "sequence";

            const label = isRequired ? (
              <span className="required">{column.header}</span>
            ) : (
              column.header
            );

            const validationRules = {
              required: isRequired,
              maxLength:
                column.accessorKey === "description"
                  ? {
                      value: 255,
                      message: CommonMessage.MFE00003.replace(
                        "%s",
                        "Description"
                      ).replace("%s", "255"),
                    }
                  : false,
            };

            return (
              !isExcludedKey && (
                <FormInputText
                  key={column.accessorKey}
                  control={control}
                  label={label}
                  name={column.accessorKey}
                  rules={validationRules}
                />
              )
            );
          })}
          <DialogActions sx={{ p: "1.25rem" }}>
            <Button
              onClick={() => {
                reset();
                setEditValues("");
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={() => {
                handleSubmit((data) => onSubmit(data, editFlag))();
              }}
              variant="contained"
            >
              {editFlag === true ? "Update" : "Save"}
            </Button>
          </DialogActions>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default CreateApprovalWorkflowModal;
