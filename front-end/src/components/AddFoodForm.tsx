import AddIcon from "@mui/icons-material/Add";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  Snackbar,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { addFood } from "../containers/axios/addFood";
import { FoodDetails } from "../containers/axios/getFoodsList";

interface Props {
  resetList: () => void;
}

export const AddFoodForm = ({ resetList }: Props) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleCloseDialog = () => {
    setOpenDialog(false);
    reset();
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<FoodDetails>();

  const onSubmit = async (data: FoodDetails) => {
    const error = await addFood(data);

    if (error) {
      setIsLoading(false);
      setIsError(true);
    } else {
      setIsLoading(false);
      setIsError(false);
      setMessage("Food added successfully");
      setOpenSnackbar(true);
      handleCloseDialog();
      resetList();
    }
  };

  return (
    <Container component="div" maxWidth="xs">
      <Box
        style={{
          display: "flex",
          justifyContent: "flex-end",
          position: "absolute",
          bottom: "100px",
          right: "30px",
          zIndex: 999,
        }}
      >
        <Fab
          size="small"
          color="primary"
          aria-label="add"
          onClick={() => {
            setOpenDialog(true);
          }}
        >
          <AddIcon />
        </Fab>
      </Box>

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
        <DialogTitle>Add Food</DialogTitle>
        <Box
          component="form"
          noValidate
          sx={{ mt: 1 }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <DialogContent>
            <TextField
              margin="normal"
              required
              fullWidth
              hiddenLabel
              type="text"
              id="food-name"
              label="Food name"
              {...register("name", { required: true })}
              helperText={errors.name && "Food name is require."}
              error={Boolean(errors.name)}
              InputLabelProps={{
                shrink: Boolean(watch("name")),
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              type="number"
              label="Calories per 100gr"
              id="cal-per-100gr"
              {...register("caloriesPer100g", { required: true })}
              helperText={
                errors.caloriesPer100g && "CaloriesPer100g  is require."
              }
              error={Boolean(errors.caloriesPer100g)}
              InputLabelProps={{
                shrink: Boolean(watch("caloriesPer100g")),
              }}
            />
            <TextField
              margin="normal"
              fullWidth
              type="number"
              label="DefaultWeight"
              id="defaultWeight"
              {...register("defaultWeight")}
              error={Boolean(errors.defaultWeight)}
              InputLabelProps={{
                shrink: Boolean(watch("defaultWeight")),
              }}
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            {isLoading ? (
              <CircularProgress />
            ) : (
              <Button type="submit" disabled={isLoading}>
                Submit
              </Button>
            )}
          </DialogActions>
          {isError && <Alert severity="error">Something went wrong!</Alert>}
        </Box>
      </Dialog>
    </Container>
  );
};
