"use client";
import { useState } from "react";
import List from "./List";
import ListWrapper from "@/app/components/ListWrapper";

const Attributes = () => {
  const [refresh, setRefresh] = useState(false);

  return (
    <ListWrapper>
      <List refresh={refresh} setRefresh={setRefresh} />
    </ListWrapper>
  );
};

export default Attributes;
