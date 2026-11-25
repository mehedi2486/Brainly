import "./index.css";
import { Button } from "./components/Ui/Button";
import { PlusIcon } from "./icons/PlusIcon";


export function App() {
  return (
    <>
      <Button startIcon={<PlusIcon />} size="sm" variant="primary" text="Share" />
      <Button size="md" variant="secondary" text="Addd content" />
      <Button size="lg" variant="secondary" text="Addd content" />
    </>
  );
}
