'use client';

import SwaggerUI from "swagger-ui-react";
import 'swagger-ui-react/swagger-ui.css';
import '../swagger-custom.css';

type Props = {
  spec: Record<string, string | number>,
};

function ReactSwagger({ spec }: Props) {
  return <SwaggerUI spec={spec} />;
}

export default ReactSwagger;