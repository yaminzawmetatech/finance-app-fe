import React from "react";
import { Modal, Button, IconButton  } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const DeleteConfirmationModal = ({ isOpen, onClose, onDelete, message }) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className="modal-content">
        <h3>Delete Confirmation</h3>
        <IconButton onClick={onClose} style={{ position: "absolute", top: "10px", right: "10px" }}>
            <CloseIcon />
        </IconButton>
        <p className="confirm-content">{message}</p>
        <div className="modal-actions">
          <Button className="confirm-cancel-btn" variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button className="confirm-delete-btn" variant="contained" onClick={onDelete} color="error">
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;
