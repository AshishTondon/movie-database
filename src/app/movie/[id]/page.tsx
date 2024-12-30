"use client";

import MovieFrom from "../form";
import React, { useMemo } from "react";
import { useSearchParams, useParams } from "next/navigation";

const EditMovie = () => {
  const queryString = useSearchParams();
  const params = useParams<{ id: string }>();

  const title = useMemo(() => queryString.get("title"), [queryString]);
  const year = useMemo(() => queryString.get("year"), [queryString]);
  const url = useMemo(() => queryString.get("url"), [queryString]);

  return (
    <MovieFrom
      header="Edit"
      title={title ?? ""}
      year={Number(year) ?? 0}
      url={url ?? ""}
      id={params.id}
    />
  );
};

export default EditMovie;
