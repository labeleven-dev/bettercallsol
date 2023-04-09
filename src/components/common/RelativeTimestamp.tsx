import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useState } from "react";

dayjs.extend(relativeTime);

export const RelativeTimestamp: React.FC<{
  timestamp: string | number | Date | undefined;
  intervalInSeconds?: number;
}> = ({ timestamp, intervalInSeconds = 60 }) => {
  const [currentTime, setCurrentTime] = useState(dayjs());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs());
    }, intervalInSeconds * 1000);

    return () => clearInterval(interval);
  }, []);

  return <span>{dayjs(timestamp).from(currentTime)}</span>;
};
