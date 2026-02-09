import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/components/ui/dropdown-menu";
import { Button } from "@/app/components/ui/button";
import { UserCog, Edit, MoreVertical } from "lucide-react";
import { UiUser } from "./types";

interface Props {
    usuario: UiUser;
    onStatus: (u: UiUser) => void;
    onEdit: (u: UiUser) => void;
}

export function UserActionsMenu({ usuario, onStatus, onEdit }: Props) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onStatus(usuario)}>
                    <UserCog className="w-4 h-4 mr-2" />
                    Cambiar Estado
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(usuario)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
