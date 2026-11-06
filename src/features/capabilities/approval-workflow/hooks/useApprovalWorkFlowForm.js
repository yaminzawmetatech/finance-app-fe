import { useState, useEffect, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { getAddressTownships } from "features/address/Township/addressTownshipSlice";
import {
  createAddressCity,
  getAddressCities,
  updateAddressCity,
} from "features/address/City/addressCitySlice";
import { showErrorToast, showSuccessToast } from "common/ToastMessage";
import CommonMessage from "common/CommonMessage";
import {
  createApprovalWorkflow,
  getApprovalWorkflows,
  updateApprovalWorkflow,
} from "features/approvalWorkflow/approvalWorkflowSlice";

const useApprovalWorkFlowForm = () => {
  const dispatch = useDispatch();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editValues, setEditValues] = useState([]); // row values to edit

  const { control, reset, handleSubmit } = useForm({});

  const { approvalWorkflows, isLoading, isSuccess, isError, message } =
    useSelector((state) => state.approvalWorkflows);

  useEffect(() => {
    dispatch(getApprovalWorkflows());
  }, [dispatch]);

  useEffect(() => {
    reset({
      ...editValues,
    });
  }, [reset, editValues]);

  const onSubmit = useCallback(
    async (body, editFlag) => {
      try {
        if (editFlag) {
          await dispatch(
            updateApprovalWorkflow({ id: editValues?.uuid, newData: body })
          ).unwrap();

          showSuccessToast(
            CommonMessage.MFS00003.replace("%s", "Approval Workflow")
          );
        } else {
          await dispatch(createApprovalWorkflow({ ...body })).unwrap();
          showSuccessToast(
            CommonMessage.MFS00001.replace("%s", "Approval Workflow")
          );
        }
        reset();
        setEditValues("");
        setCreateModalOpen(false);
        await dispatch(getApprovalWorkflows());
      } catch (error) {
        console.error("Error", error);
      }
    },
    [dispatch, editValues, reset]
  );
  return useMemo(
    () => ({
      isLoading,
      onSubmit,
      handleSubmit,
      control,
      approvalWorkflows,
      createModalOpen,
      setCreateModalOpen: (value) => setCreateModalOpen(value),
      setEditValues: (value) => setEditValues(value),
      reset,
    }),
    [
      isLoading,
      onSubmit,
      handleSubmit,
      control,
      approvalWorkflows,
      createModalOpen,
      setCreateModalOpen,
      setEditValues,
      reset,
    ]
  );
};

export default useApprovalWorkFlowForm;
