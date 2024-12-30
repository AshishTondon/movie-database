"use client";

import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";
import "../swagger-custom.css";
import { IObject } from "@/app/common/api-request";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

type IProps = {
  spec: IObject<string | number | object>;
};

function ReactSwagger({ spec }: IProps) {
  return <SwaggerUI spec={spec} />;
}

export default ReactSwagger;
