import { Button } from "@/app/components/ui/button";

interface Props {
    loading: boolean;
    canPaginate: boolean;
    page: number;
    setPage: (v: number) => void;
    safeTotal?: number;
    safePageSize?: number;
}

export function UsuariosPagination({ loading, canPaginate, page, setPage, safeTotal, safePageSize }: Props) {
    if (!canPaginate) return null;
    return (
        <div className="flex justify-end mt-4 items-center">
            <Button
                variant="outline"
                disabled={loading || !canPaginate || page <= 1}
                onClick={() => setPage(Math.max(1, page - 1))}
            >
                Anterior
            </Button>
            <span className="mx-2">Página {page}</span>
            <Button
                variant="outline"
                disabled={loading || !canPaginate || (safeTotal as number) <= page * (safePageSize as number)}
                onClick={() => setPage(page + 1)}
            >
                Siguiente
            </Button>
        </div>
    );
}
