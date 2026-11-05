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
import userGroupsService from "../../roles/services/rolesService";
import positionsService from "../../positions/services/positionsService";
import departmentsService from "../../departments/services/departmentsService";
import nrcStatesService from "../../nrc-states/services/nrcStatesService";
import nrcTownshipsService from "../../nrc-townships/services/nrcTownshipsService";

import {
  showSuccessToast,
  showErrorToast,
} from "../../../../components/common/ToastMessage";

const UsersList = () => {
  const dispatch = useDispatch();

  // Redux state
  const { users = [], isLoading } = useSelector((state) => state.users);
  const [userGroups, setUserGroups] = useState([]);
  const [positions, setPositions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [nrcStates, setNrcStates] = useState([]);
  const [nrcTownships, setNrcTownships] = useState([]);
  const [groupsLoading, setGroupsLoading] = useState(true);
  const [positionsLoading, setPositionsLoading] = useState(true);
  const [departmentsLoading, setDepartmentsLoading] = useState(true);
  const [nrcLoading, setNrcLoading] = useState(true);

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

  useEffect(() => {
    let active = true;
    userGroupsService
      .getUserGroups()
      .then((response) => {
        const payload = response?.data ?? response;
        const groups = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
            ? payload.data
            : [];
        if (active) setUserGroups(groups);
      })
      .catch((error) => {
        showErrorToast(
          error.response?.data?.message ||
            error.message ||
            "Failed to fetch user groups."
        );
      })
      .finally(() => {
        if (active) setGroupsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    Promise.all([
      nrcStatesService.getStates(),
      nrcTownshipsService.getTownships(),
    ])
      .then(([statesResponse, townshipsResponse]) => {
        const getItems = (response) => {
          const payload = response?.data ?? response;
          if (Array.isArray(payload)) return payload;
          if (Array.isArray(payload?.data)) return payload.data;
          return [];
        };
        if (active) {
          setNrcStates(getItems(statesResponse));
          setNrcTownships(getItems(townshipsResponse));
        }
      })
      .catch((error) => {
        showErrorToast(
          error.response?.data?.message ||
            error.message ||
            "Failed to fetch NRC states and townships."
        );
      })
      .finally(() => {
        if (active) setNrcLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    departmentsService
      .getDepartments()
      .then((response) => {
        const payload = response?.data ?? response;
        const items = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
            ? payload.data
            : [];
        if (active) setDepartments(items);
      })
      .catch((error) => {
        showErrorToast(
          error.response?.data?.message ||
            error.message ||
            "Failed to fetch departments."
        );
      })
      .finally(() => {
        if (active) setDepartmentsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    positionsService
      .getPositions()
      .then((response) => {
        const payload = response?.data ?? response;
        const items = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
            ? payload.data
            : [];
        if (active) setPositions(items);
      })
      .catch((error) => {
        showErrorToast(
          error.response?.data?.message ||
            error.message ||
            "Failed to fetch positions."
        );
      })
      .finally(() => {
        if (active) setPositionsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // Table columns
  const columns = useMemo(
    () => [
      {
        accessorKey: "user_name",
        header: "User Name",
        size: 180,
      },
      {
        accessorKey: "father_name",
        header: "Father Name",
        size: 180,
      },
      {
        accessorKey: "dob",
        header: "DOB",
        size: 140,
      },
      {
        accessorKey: "nrc",
        header: "NRC",
        size: 220,
      },
      {
        accessorKey: "csc",
        header: "CSC",
        size: 120,
      },
      {
        accessorKey: "personal_email",
        header: "Personal Email",
        size: 220,
      },
      {
        accessorKey: "office_email",
        header: "Office Email",
        size: 220,
      },
      {
        accessorKey: "personal_phone",
        header: "Personal Phone",
        size: 150,
      },
      {
        accessorKey: "company_phone",
        header: "Company Phone",
        size: 150,
      },
      {
        accessorKey: "level",
        header: "Level",
        size: 100,
      },
      {
        accessorFn: (row) => row.department || row.department_name || "",
        id: "department",
        header: "Department",
        size: 200,
      },
      {
        accessorFn: (row) => row.position || row.position_name || "",
        id: "position",
        header: "Position",
        size: 180,
      },
      {
        accessorFn: (row) =>
          row.userGroup || row.role?.name || row.role_name || "",
        id: "userGroup",
        header: "User Group",
        size: 180,
      },
      {
        accessorFn: (row) =>
          row.customer_web_role_name || row.customerWebRole?.name || "",
        id: "customerWebRole",
        header: "Customer Web Role",
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
        result = await dispatch(updateUser({
          id: editData.uuid || editData.id,
          data,
        }));
      } else {
        result = await dispatch(createUser(data));
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
      showErrorToast(error.message || "Unable to save user.");
    }
  };

  // Confirm delete
  const handleDeleteConfirmed = async () => {
    if (!deleteData) return;

    try {
      const result = await dispatch(
        deleteUser(deleteData.uuid || deleteData.id)
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
      showErrorToast(error.message || "Unable to delete user.");
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
        isLoading={
          isLoading ||
          groupsLoading ||
          positionsLoading ||
          departmentsLoading ||
          nrcLoading
        }
        userGroups={userGroups}
        positions={positions}
        departments={departments}
        positionsLoading={positionsLoading}
        departmentsLoading={departmentsLoading}
        nrcStates={nrcStates}
        nrcTownships={nrcTownships}
        nrcLoading={nrcLoading}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeleteData(null);
        }}
        onDelete={handleDeleteConfirmed}
        message={`Are you sure you want to delete ${
          deleteData?.user_name || "this user"
        }?`}
      />

    </Box>
  );
};

export default UsersList;