import { AlertTriangle } from "lucide-react";

interface StatusListItemProps {
    icon: typeof AlertTriangle;
    text: string;
    color: string;
  }

  export const StatusListItem = ({ icon: Icon, text, color }: StatusListItemProps) => (
    <li className={`flex items-center text-sm ${color}`}>
      <Icon className="w-4 h-4 mr-2" />
      {text}
    </li>
  );
