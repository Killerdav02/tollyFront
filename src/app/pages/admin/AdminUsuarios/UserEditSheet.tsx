import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/app/components/ui/sheet";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { UiUser } from "./types";

interface Props {
    editModalOpen: boolean;
    setEditModalOpen: (v: boolean) => void;
    selectedUser: UiUser | null;
    editFormData: any;
    handleEditFormChange?: (field: string, value: string) => void;
    handleSaveEdit?: () => void;
}

export function UserEditSheet({ editModalOpen, setEditModalOpen, selectedUser, editFormData, handleEditFormChange, handleSaveEdit }: Props) {
    return (
        <Sheet open={editModalOpen} onOpenChange={setEditModalOpen}>
            <SheetContent className="overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Editar Usuario</SheetTitle>
                    <SheetDescription>
                        Modifica la información del usuario {selectedUser?.nombre ?? selectedUser?.email ?? ''}.
                    </SheetDescription>
                </SheetHeader>
                <div className="mt-6 mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-2">
                        <div>
                            <Label className="text-xs text-gray-500">Email</Label>
                            <p className="font-medium">{selectedUser?.email ?? '-'}</p>
                        </div>
                        <div>
                            <Label className="text-xs text-gray-500">Rol</Label>
                            <p className="font-medium capitalize">{selectedUser?.rol ?? '-'}</p>
                        </div>
                    </div>
                </div>
                <div className="space-y-4">
                    {selectedUser?.rol === 'cliente' && (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="first_name" className="block w-72 max-w-full mx-auto text-left">Nombre *</Label>
                                <Input id="first_name" placeholder="Ingresa el nombre" value={editFormData.first_name} onChange={(e) => handleEditFormChange && handleEditFormChange('first_name', e.target.value)} required className="mx-auto block text-gray-100 bg-[#2a4644] border-[#3d5a5a] rounded-md w-72 max-w-full placeholder:text-gray-300" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="last_name" className="block w-72 max-w-full mx-auto text-left">Apellido *</Label>
                                <Input id="last_name" placeholder="Ingresa el apellido" value={editFormData.last_name} onChange={(e) => handleEditFormChange && handleEditFormChange('last_name', e.target.value)} required className="mx-auto block text-gray-100 bg-[#2a4644] border-[#3d5a5a] rounded-md w-72 max-w-full placeholder:text-gray-300" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address" className="block w-72 max-w-full mx-auto text-left">Dirección *</Label>
                                <Input id="address" placeholder="Calle, ciudad, código postal" value={editFormData.address} onChange={(e) => handleEditFormChange && handleEditFormChange('address', e.target.value)} required className="mx-auto block text-gray-100 bg-[#2a4644] border-[#3d5a5a] rounded-md w-72 max-w-full placeholder:text-gray-300" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="document_id" className="block w-72 max-w-full mx-auto text-left">Documento de Identidad *</Label>
                                <Input id="document_id" placeholder="Número de documento" value={editFormData.document_id} onChange={(e) => handleEditFormChange && handleEditFormChange('document_id', e.target.value)} required className="mx-auto block text-gray-100 bg-[#2a4644] border-[#3d5a5a] rounded-md w-72 max-w-full placeholder:text-gray-300" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone_number" className="block w-72 max-w-full mx-auto text-left">Número de Teléfono *</Label>
                                <Input id="phone_number" type="tel" placeholder="+1 234 567 8900" value={editFormData.phone_number} onChange={(e) => handleEditFormChange && handleEditFormChange('phone_number', e.target.value)} required className="mx-auto block text-gray-100 bg-[#2a4644] border-[#3d5a5a] rounded-md w-72 max-w-full placeholder:text-gray-300" />
                            </div>
                        </>
                    )}
                    {selectedUser?.rol === 'proveedor' && (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="company_name" className="block w-72 max-w-full mx-auto text-left">Nombre de la Empresa *</Label>
                                <Input id="company_name" placeholder="Nombre de la empresa" value={editFormData.company_name} onChange={(e) => handleEditFormChange && handleEditFormChange('company_name', e.target.value)} required className="mx-auto block text-gray-100 bg-[#2a4644] border-[#3d5a5a] rounded-md w-72 max-w-full placeholder:text-gray-300" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contact_name" className="block w-72 max-w-full mx-auto text-left">Nombre de Contacto *</Label>
                                <Input id="contact_name" placeholder="Persona de contacto" value={editFormData.contact_name} onChange={(e) => handleEditFormChange && handleEditFormChange('contact_name', e.target.value)} required className="mx-auto block text-gray-100 bg-[#2a4644] border-[#3d5a5a] rounded-md w-72 max-w-full placeholder:text-gray-300" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="identification" className="block w-72 max-w-full mx-auto text-left">Identificación *</Label>
                                <Input id="identification" placeholder="RUC o número de identificación" value={editFormData.identification} onChange={(e) => handleEditFormChange && handleEditFormChange('identification', e.target.value)} required className="mx-auto block text-gray-100 bg-[#2a4644] border-[#3d5a5a] rounded-md w-72 max-w-full placeholder:text-gray-300" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="block w-72 max-w-full mx-auto text-left">Teléfono *</Label>
                                <Input id="phone" type="tel" placeholder="+1 234 567 8900" value={editFormData.phone} onChange={(e) => handleEditFormChange && handleEditFormChange('phone', e.target.value)} required className="mx-auto block text-gray-100 bg-[#2a4644] border-[#3d5a5a] rounded-md w-72 max-w-full placeholder:text-gray-300" />
                            </div>
                        </>
                    )}
                </div>
                <SheetFooter className="mt-6">
                    <Button type="button" variant="outline" onClick={() => setEditModalOpen(false)}>
                        Cancelar
                    </Button>
                    <Button type="button" onClick={handleSaveEdit} className="bg-[#3d5a5a] hover:bg-[#2a4644]">
                        Guardar Cambios
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
