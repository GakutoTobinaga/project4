"use client"
import { DateRangePicker, DateRangePickerItem, DateRangePickerValue } from "@tremor/react";
import { ja } from "date-fns/locale"; // 日本語ロケールをインポート
import { useState, useEffect } from "react";

export function DatePicker() {
  const [value, setValue] = useState<DateRangePickerValue>({
    from: new Date(2023, 1, 1),
    to: new Date(),
  });
/*
  useEffect(() => {
    onDateSelect(value);
  }, [value]);
*/

  return (
    <>
      <DateRangePicker
        className="max-w-md mx-auto"
        value={value}
        onValueChange={setValue}
        locale={ja} // 日本語ロケールを設定
        selectPlaceholder="選択"
        color="rose"
      >
        <DateRangePickerItem key="ytd" value="ytd" from={new Date(2023, 0, 1)}>
          年始から現在まで
        </DateRangePickerItem>
        <DateRangePickerItem
          key="firstHalf"
          value="firstHalf"
          from={new Date(2023, 0, 1)}
          to={new Date(2023, 4, 31)}
        >
          上半期
        </DateRangePickerItem>
        <DateRangePickerItem
          key="secondHalf"
          value="secondHalf"
          from={new Date(2023, 5, 1)}
          to={new Date(2023, 11, 31)}
        >
          下半期
        </DateRangePickerItem>
      </DateRangePicker>
    </>
  );
}
