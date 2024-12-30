import { getApiDocs } from "@/app/common/swagger-config";
import ReactSwagger from "./react-swagger";
import { IObject } from "@/app/common/api-request";

export default async function IndexPage() {
  const spec = await getApiDocs() as unknown as IObject<string | number | object>;
  
  return (
    <section className="container">
      <ReactSwagger spec={spec} />
    </section>
  );
}
