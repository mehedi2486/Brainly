import "./index.css";
import { Button } from "./components/Button";
import { ShareIcon } from "./icons/ShareIcon";
import { PlusIcon } from "./icons/PlusIcon";
import { Card } from "./components/Card";
export function App() {
  return (
    <>
    <div>
      <Button varient="primary" text="Add Content" startIcon={<PlusIcon />}/>
      <Button varient="secondary" text="Share Brain" startIcon={<ShareIcon />}/>
      <Card title="Three js tweet" link="https://x.com/xikhar/status/2126470165609222301?a=TRj19s41pOxwDGHY3H0&s=20" type="tweet"/>
      <Card title="sakamoto days" link="https://youtu.be/EwWkyHaSmkE?si=CpH6mvZghuaTsck2" type="youtube" />
    </div>
    
    </>
  );
}
