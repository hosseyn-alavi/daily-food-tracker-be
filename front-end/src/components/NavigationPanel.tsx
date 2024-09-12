import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import TableViewIcon from "@mui/icons-material/TableView";
import SoupKitchenIcon from "@mui/icons-material/SoupKitchen";
import { useState } from "react";

interface Props {
  handleGoToRecords: () => void;
  handleGoToMain: () => void;
  handleGoToFoods: () => void;
}

export const NavigationPanel = ({
  handleGoToRecords,
  handleGoToMain,
  handleGoToFoods,
}: Props) => {
  const [value, setValue] = useState(0);

  return (
    <div>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction
          label="Home"
          icon={<HomeIcon />}
          onClick={handleGoToMain}
        />
        <BottomNavigationAction
          label="View"
          icon={<TableViewIcon />}
          onClick={handleGoToRecords}
        />
        <BottomNavigationAction
          label="Foods"
          icon={<SoupKitchenIcon />}
          onClick={handleGoToFoods}
        />
      </BottomNavigation>
    </div>
  );
};
