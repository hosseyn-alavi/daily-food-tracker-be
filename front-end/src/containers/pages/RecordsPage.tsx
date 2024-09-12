import { Container, Box, Paper, Typography } from "@mui/material";
import { GetRecordResponse, getDailyRecords } from "../axios/getDailyRecords";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { TotalDailyCalories } from "../../components/TotalDailyCalories";
import { DeleteButton } from "../../components/DeleteButton";

export const RecordsPage = () => {
  const [records, setRecords] = useState<GetRecordResponse>({ records: [] });

  const getRecords = async (date?: Date) => {
    const res = await getDailyRecords(date);
    if (res) {
      setRecords(res);
    }
  };

  useEffect(() => {
    getRecords();
  }, []);

  return (
    <Container
      component="div"
      maxWidth="xs"
      sx={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          sx={{
            marginTop: 3,
            marginBottom: 2,
          }}
          disableFuture
          defaultValue={dayjs(new Date())}
          format="DD MMM YYYY"
          onChange={(e) => {
            getRecords(e?.toDate());
          }}
        />
      </LocalizationProvider>
      <Box>
        <TotalDailyCalories dailyRecordsCal={records} />
      </Box>

      <Box
        sx={{
          marginTop: 1,
          display: "flex",
          flexDirection: "column-reverse",
          alignItems: "center",
        }}
      >
        {records.records.map((record) => (
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
              <Typography variant="body1">Food name = {record.name}</Typography>
              {record.id && (
                <DeleteButton
                  id={record.id}
                  resetList={getRecords}
                  type="record"
                />
              )}
            </Box>

            <Typography variant="body1">Amount = {record.amount}</Typography>

            <Typography variant="body1">Total Cal = {record.total}</Typography>
          </Paper>
        ))}
      </Box>
    </Container>
  );
};
