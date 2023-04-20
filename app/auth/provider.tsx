import { Amplify } from "aws-amplify";
import awsconfig from "../../src/aws-exports";

Amplify.configure({ ...awsconfig, ssr: true });

export default function AmplifyProvider({ children }: React.PropsWithChildren) {
  return <>{children}</>;
}
