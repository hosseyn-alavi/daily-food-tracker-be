import { Container, Box, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { FoodDetails, getFoodsList } from "../axios/getFoodsList";
import { AddFoodForm } from "../../components/AddFoodForm";
import { DeleteButton } from "../../components/DeleteButton";

export const FoodsPage = () => {
  const [foodList, setFoodList] = useState<FoodDetails[]>([]);

  const getFoods = async () => {
    const res = await getFoodsList();
    if (res) {
      setFoodList(res);
    }
  };

  useEffect(() => {
    getFoods();
  }, []);

  return (
    <Container component="div" maxWidth="xs">
      <Box
        sx={{
          marginTop: 1,
          display: "flex",
          flexDirection: "column-reverse",
          alignItems: "center",
        }}
      >
        {foodList.map((item) => (
          <Paper
            variant="outlined"
            sx={{
              p: 1,
              m: 0.5,
              width: 300,
              flexDirection: "column",
              display: "flex",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                height: 25,
              }}
            >
              <Typography variant="body1">Food name = {item.name}</Typography>
              {item.id && (
                <DeleteButton id={item.id} resetList={getFoods} type="food" />
              )}
            </Box>

            <Typography variant="body1">
              Calories in 100gr = {item.caloriesPer100g}
            </Typography>

            <Typography variant="body1">
              Weight = {item.defaultWeight}
            </Typography>
          </Paper>
        ))}
      </Box>
      <AddFoodForm resetList={getFoods} />
    </Container>
  );
};
