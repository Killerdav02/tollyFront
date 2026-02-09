import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/app/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { capLabel } from "./helpers";
import { UiStatus } from "./types";

interface Props {
    statusModalOpen: boolean;
    setStatusModalOpen: (v: boolean) => void;
    selectedUser: any;
    newStatus: UiStatus;
    setNewStatus: (v: UiStatus) => void;
    handleSaveStatus?: () => void;
}

export function UserStatusDialog({ statusModalOpen, setStatusModalOpen, selectedUser, newStatus, setNewStatus, handleSaveStatus }: Props) {
    return (
        <Dialog open={statusModalOpen} onOpenChange={setStatusModalOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Cambiar Estado de Usuario</DialogTitle>
                    <DialogDescription>
                        Selecciona el nuevo estado para el usuario {selectedUser?.nombre ?? selectedUser?.email ?? ''}.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center mb-4">
                    <Badge className="text-white bg-[#3d5a5a] border-none px-4 py-1 text-base">
                        {capLabel(newStatus)}
                    </Badge>
                </div>
                <Select value={newStatus} onValueChange={(value) => setNewStatus(value as UiStatus)}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona un estado" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="activo">Activo</SelectItem>
                        <SelectItem value="inactivo">Inactivo</SelectItem>
                        <SelectItem value="bloqueado">Bloqueado</SelectItem>
                        <SelectItem value="suspendido">Suspendido</SelectItem>
                    </SelectContent>
                </Select>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setStatusModalOpen(false)}>
                        Cancelar
                    </Button>
                    <Button type="button" onClick={handleSaveStatus}>
                        Guardar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
