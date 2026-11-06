import { useState, useEffect, useMemo, useCallback } from "react";

import { useDispatch, useSelector } from "react-redux";
import {
    getApprovalWorkflows,
} from "../../../capabilities/approval-workflow/store/approvalWorkflowSlice";

const ApplicationsList = () => {

    const dispatch = useDispatch();

    const { approvalWorkflows,  } =
    useSelector((state) => state.approvalWorkflows);

    useEffect(() => {
        dispatch(getApprovalWorkflows());
    }, [dispatch]);

    
    return (
        <div>
            <h1>Application List</h1>
            <h5>{approvalWorkflows}</h5>
        </div>
    );
};

export default ApplicationsList;