import React, { useCallback, useState } from "react";
import { View } from "react-native";
import { DatePickerModal } from "react-native-paper-dates";

const DateRangePickerComponent = ({ open, setOpen, onSelectDates }) => {
  const [range, setRange] = useState({ startDate: undefined, endDate: undefined });

  const onDismiss = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirm = useCallback(({ startDate, endDate }) => {
    setOpen(false);
    setRange({ startDate, endDate });
    if (onSelectDates) {
      onSelectDates(startDate, endDate);
    }
  }, [setOpen, onSelectDates]);

  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <DatePickerModal
        // disableStatusBarPadding
        locale="en"
        mode="range"
        visible={open}
        onDismiss={onDismiss}
        startDate={range.startDate}
        endDate={range.endDate}
        onConfirm={onConfirm}
        startYear={2023}
        endYear={2024}
      />
    </View>
  );
};

export default DateRangePickerComponent;
