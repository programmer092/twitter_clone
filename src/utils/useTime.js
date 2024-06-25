const useTime = () => {
  const time = (timestamp) => {
    // const milliseconds =
    //   timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;
    const milliseconds = timestamp;
    const date = new Date(milliseconds);

    const day = date.getDate();
    const year = date.getFullYear();

    const monthName = new Intl.DateTimeFormat("en-US", {
      month: "long",
    }).format(date);

    const tweetTime = `${monthName} ${day} , ${year}`;

    return tweetTime;
  };

  return { time };
};

export default useTime;
