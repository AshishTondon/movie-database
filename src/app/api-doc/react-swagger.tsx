import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import "../swagger-custom.css";
import { IObject } from "@/app/common/api-request";

type IProps = {
  spec: IObject<string | number | object>;
};

function ReactSwagger({ spec }: IProps) {
  return <SwaggerUI spec={spec} />;
}

export default ReactSwagger;
