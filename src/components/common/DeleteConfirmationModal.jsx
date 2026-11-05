import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onDelete,
  message,
  isLoading = false,
  title = "Confirm deletion",
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={() => !isLoading && onClose()}
      fullWidth
      maxWidth="xs"
      aria-labelledby="delete-confirmation-title"
    >
      <DialogTitle
        id="delete-confirmation-title"
        sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pr: 1 }}
      >
        {title}
        <IconButton
          aria-label="Close confirmation"
          onClick={onClose}
          disabled={isLoading}
          size="small"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography color="text.secondary" sx={{ whiteSpace: "pre-line" }}>
          {message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={onDelete}
          disabled={isLoading}
        >
          {isLoading ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
