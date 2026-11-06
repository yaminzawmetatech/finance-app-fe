import axiosInstance from "../../../../core/api/axiosInstance"

const API_URL = `approval-work-flows`

// Get Data
const getApprovalWorkflows = async (access_token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  }

  const response = await axiosInstance.get(API_URL, config)

  return response.data
}

// Create 
const createApprovalWorkflow = async (approvalWorkflowData, token) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  
    const response = await axiosInstance.post(API_URL, approvalWorkflowData, config)
  
    return response.data
}

// update
const updateApprovalWorkflow = async(approvalWorkflowId, approvalWorkflowData, token) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  
    const response = await axiosInstance.put(API_URL +'/'+approvalWorkflowId, approvalWorkflowData, config)
  
    return response.data;  
}

// Delete 
const deleteApprovalWorkflow = async (approvalWorkflowId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axiosInstance.delete(API_URL +'/'+ approvalWorkflowId, config)

  return response.data
}

const approvalWorkflowService = {
  getApprovalWorkflows,
  createApprovalWorkflow,
  updateApprovalWorkflow,
  deleteApprovalWorkflow,
}

export default approvalWorkflowService
