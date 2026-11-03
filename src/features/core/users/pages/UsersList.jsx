import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Box,
  Breadcrumbs,
  Paper,
  Typography,
} from "@mui/material";

import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../store/usersSlice";

import Table from "../../../../components/tables/Table";

import DeleteConfirmationModal from "../../../../components/common/DeleteConfirmationModal";

import UserForm from "../components/UserForm";

import {
  showSuccessToast,
  showErrorToast,
} from "../../../../components/common/ToastMessage";

const UsersList = () => {
  const dispatch = useDispatch();

  // Redux state
  const {
    users,
    isLoading,
    isSubmitting,
  } = useSelector((state) => state.users);

  // Local state
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [editData, setEditData] = useState(null);

  const [deleteData, setDeleteData] = useState(null);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    const result = await dispatch(getUsers());

    if (getUsers.rejected.match(result)) {
      showErrorToast(
        result.payload || "Failed to fetch users."
      );
    }
  }, [dispatch]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Table columns
  const columns = useMemo(
    () => [
      {
        accessorKey: "user_name",
        header: "User Name",
        size: 200,
      },
      {
        accessorKey: "office_email",
        header: "Email",
        size: 250,
      },
      {
        accessorKey: "phone",
        header: "Phone",
        size: 150,
      },
      {
        accessorKey: "created_at",
        header: "Created Date",
        size: 180,
      },
    ],
    []
  );

  // Create new user
  const handleCreate = () => {
    setEditData(null);
    setCreateModalOpen(true);
  };

  // Edit user
  const handleEdit = (row) => {
    setEditData(row.original);
    setCreateModalOpen(true);
  };

  // Delete user
  const handleDelete = (row) => {
    setDeleteData(row.original);
    setDeleteModalOpen(true);
  };

  // Create / Update submit
  const handleSubmit = async (data) => {
    try {
      let result;

      if (editData) {
        result = await dispatch(
          updateUser({
            id: editData.id,
            data,
          })
        );
      } else {
        result = await dispatch(createUser({
          ...data,
          role_id: 1,
          position_id: 1,
          department_id: 1,
          personal_email: "admin@mail.com"	
        }));
      }

      if (
        createUser.fulfilled.match(result) ||
        updateUser.fulfilled.match(result)
      ) {
        showSuccessToast(
          editData
            ? "User updated successfully."
            : "User created successfully."
        );

        setCreateModalOpen(false);
        setEditData(null);

        fetchUsers();
      } else {
        showErrorToast(
          result.payload || "Unable to save user."
        );
      }
    } catch (error) {
      showErrorToast("Something went wrong.");
    }
  };

  // Confirm delete
  const handleDeleteConfirmed = async () => {
    if (!deleteData) return;

    try {
      const result = await dispatch(
        deleteUser(deleteData.id)
      );

      if (deleteUser.fulfilled.match(result)) {
        showSuccessToast("User deleted successfully.");

        setDeleteModalOpen(false);
        setDeleteData(null);

        fetchUsers();
      } else {
        showErrorToast(
          result.payload || "Unable to delete user."
        );
      }
    } catch (error) {
      showErrorToast("Something went wrong while deleting user.");
    }
  };

  return (
    <Box sx={{ width: "100%" }}>

      {/* Breadcrumb */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Typography color="text.primary">
          Administration
        </Typography>

        <Typography color="text.primary">
          User Management
        </Typography>

        <Typography color="text.primary">
          User List
        </Typography>
      </Breadcrumbs>

      {/* User Table */}
      <Paper
        elevation={1}
        sx={{
          width: "100%",
          p: 2,
          borderRadius: 2,
        }}
      >
        <Table
          columns={columns}
          data={users}
          isLoading={isLoading}
          onCreate={handleCreate}
          onEdit={handleEdit}
          onDelete={handleDelete}
          createButtonLabel="Create New User"
        />
      </Paper>

      {/* Create / Edit Modal */}
      <UserForm
        open={createModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
          setEditData(null);
        }}
        onSubmit={handleSubmit}
        editData={editData}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmationModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeleteData(null);
        }}
        onConfirm={handleDeleteConfirmed}
        message={`Are you sure you want to delete ${
          deleteData?.name || "this user"
        }?`}
        isLoading={isSubmitting}
      />

    </Box>
  );
};

export default UsersList;