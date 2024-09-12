import { Alert, Button, IconButton, Snackbar } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { Dialog, DialogActions, DialogTitle } from "@mui/material";
import { useState } from "react";
import { deleteFood } from "../containers/axios/deleteFood";
import { deleteRecord } from "../containers/axios/deleteRecord";

interface Props {
  resetList: () => void;
  id: number;
  type: "food" | "record";
}

export const DeleteButton = ({ resetList, id, type }: Props) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState("");

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDelete = async (fId: number) => {
    const error =
      type === "food"
        ? await deleteFood(fId)
        : type === "record"
        ? await deleteRecord(fId)
        : null;

    if (error) {
      setIsError(true);
    } else {
      setIsError(false);
      setMessage("Food deleted successfully");
      setOpenSnackbar(true);
      handleCloseDialog();
      resetList();
    }
  };

  return (
    <>
      <IconButton
        aria-label="logout"
        color="error"
        onClick={() => {
          setOpenDialog(true);
        }}
      >
        <ClearIcon />
      </IconButton>
      <Snackbar
        open={openSnackbar}
        anchorOrigin={{ horizontal: "center", vertical: "top" }}
        onClose={() => {
          setOpenSnackbar(false);
        }}
        autoHideDuration={3000}
      >
        <Alert severity="success">{message}</Alert>
      </Snackbar>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Are you sure?</DialogTitle>

        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>

          <Button
            onClick={() => {
              handleDelete(id);
            }}
          >
            Delete
          </Button>
        </DialogActions>
        {isError && <Alert severity="error">Something went wrong!</Alert>}
      </Dialog>
    </>
  );
};
