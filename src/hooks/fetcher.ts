const fetcher = async (
    input: RequestInfo,
    init: RequestInit,
    ...args: any[]
  ) => {
    const res = await fetch(input, {...init, credentials: "include"});
    return res.json();
  };

export default fetcher
