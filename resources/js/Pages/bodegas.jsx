"use client"

import * as React from "react"
import { Head, Link, usePage, router, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { 
    ArrowUpDown, 
    MoreHorizontal, 
    Search,
    Plus,
    Warehouse, // Ícono principal de Bodega
    MapPin,     // Para Dirección
    Globe      // Para E-commerce
} from "lucide-react"

// Componentes de shadcn/ui
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Importamos los componentes del Dialog
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

// Importamos el Checkbox para el campo booleano
import { Checkbox } from "@/components/ui/checkbox" 

/**
 * Definición de Columnas para Bodegas
 */
export const columns = [
    {
        accessorKey: "id",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-4 hover:bg-gray-100"
                >
                    ID
                    <ArrowUpDown className="ml-2 h-4 w-4 text-gray-400" />
                </Button>
            )
        },
        // **AJUSTE 1: Asignar un ancho máximo pequeño y evitar el `whitespace-nowrap`**
        // Se puede usar la clase `w-16` para hacerlo fijo o un ancho relativo si es necesario.
        // Aquí se usa un ancho pequeño y se alinea a la izquierda.
        cell: ({ row }) => <div className="font-medium text-gray-700 w-16">#{row.getValue("id")}</div>,
    },
    {
        accessorKey: "codigo",
        header: "Código",
        // **AJUSTE 2: Asignar un ancho máximo pequeño**
        cell: ({ row }) => (
            <div className="font-semibold text-gray-900 w-24">
                {row.getValue("codigo")}
            </div>
        ),
    },
    {
        accessorKey: "descripcion",
        header: "Descripción",
        // **AJUSTE 3: Permitir que el texto se ajuste con `whitespace-normal` y usar `w-auto` o `min-w-0` para flexibilidad.**
        cell: ({ row }) => (
            <div className="text-gray-700 whitespace-normal min-w-[150px]">
                {row.getValue("descripcion")}
            </div>
        ),
    },
    {
        accessorKey: "direccion",
        header: "Dirección",
        // **AJUSTE 4: Permitir que el texto se ajuste en múltiples líneas y usar `w-auto` o `min-w-0` para flexibilidad.**
        cell: ({ row }) => (
            <div className="flex items-center gap-2 text-gray-600 whitespace-normal min-w-[180px]">
                <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                {row.getValue("direccion") || 'N/A'}
            </div>
        ),
    },
    {
        accessorKey: "bodega_ecommerce",
        header: "E-commerce",
        // **AJUSTE 5: Asignar un ancho máximo pequeño y evitar el `whitespace-nowrap`**
        cell: ({ row }) => {
            const isEcommerce = row.getValue("bodega_ecommerce");
            return (
                <div className={`text-xs font-medium px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 w-24 justify-center ${
                    isEcommerce
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : 'bg-gray-100 text-gray-500 border border-gray-200'
                }`}>
                    <Globe className="h-3 w-3" />
                    {isEcommerce ? 'Sí' : 'No'}
                </div>
            );
        },
    },
    {
        id: "actions",
        size: 40, 
        minSize: 40,
        maxSize: 40,
        enableHiding: false,
        
        // Encabezado vacío pero con ancho fijo para reservar el espacio
        header: () => <div className="w-[50px]"></div>,
        // **AJUSTE 6: Asegurar que la columna de acciones tenga un ancho fijo y se alinee a la derecha.**
        cell: ({ row, table }) => {
            const bodega = row.original
            return (
                // Usamos w-[50px] fijo y flex para centrar
                <div className="flex items-center justify-center w-[50px]">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button 
                                variant="ghost" 
                                className="h-8 w-8 p-0 focus-visible:ring-0 focus:outline-none hover:bg-gray-100 text-gray-500"
                            >
                                <span className="sr-only">Abrir menú</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        
                        {/* align="end" es correcto, pero asegúrate de que no sea el causante visual */}
                        <DropdownMenuContent align="end" className="bg-white border border-gray-100 shadow-lg z-50 w-48">
                            <DropdownMenuLabel className="text-gray-500 text-xs uppercase tracking-wider">Acciones</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-gray-100" />
                            
                            <DropdownMenuItem 
                                onClick={() => table.options.meta?.handleEdit(bodega)}
                                className="cursor-pointer hover:bg-gray-50 text-gray-700"
                            >
                                Editar Bodega
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem asChild className="cursor-pointer hover:bg-red-50 text-red-600 focus:text-red-600">
                                <Link
                                    href={route('bodegas.destroy', bodega.id)}
                                    method="delete"
                                    as="button"
                                    onBefore={() => confirm('¿Estás seguro de eliminar esta bodega?')}
                                    className="w-full text-left"
                                >
                                    Eliminar
                                </Link>
                            </DropdownMenuItem>

                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },
]

/**
 * Componente Principal
 */
export default function Index({ auth, bodegas }) {
    const { flash } = usePage().props;

    // Manejo flexible de datos (si viene paginado o como array simple)
    const data = Array.isArray(bodegas) ? bodegas : (bodegas?.data || []);
    const { next_page_url, prev_page_url, total } = bodegas?.paginator || bodegas || {};

    // --- ESTADOS DE TABLA ---
    const [sorting, setSorting] = React.useState([])
    const [columnFilters, setColumnFilters] = React.useState([])
    const [globalFilter, setGlobalFilter] = React.useState('')

    // --- ESTADOS DEL DIALOG Y FORMULARIO ---
    const [isOpen, setIsOpen] = React.useState(false);
    const [isEditing, setIsEditing] = React.useState(false);

    // Hook useForm de Inertia: Campos del modelo Bodega
    const { data: formData, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        id: '',
        codigo: '',
        descripcion: '',
        direccion: '',
        bodega_ecommerce: false, // Inicializado como booleano
    });

    // --- FUNCIONES DE CONTROL DEL MODAL ---
    const openCreateModal = () => {
        setIsEditing(false);
        reset();
        clearErrors();
        setIsOpen(true);
    };

    const openEditModal = (bodega) => {
        setIsEditing(true);
        clearErrors();
        setData({
            id: bodega.id,
            codigo: bodega.codigo,
            descripcion: bodega.descripcion,
            direccion: bodega.direccion || '', // Manejo de null en dirección
            bodega_ecommerce: !!bodega.bodega_ecommerce, // Aseguramos que sea booleano
        });
        setIsOpen(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        
        // Enviamos el booleano como 1 o 0 si no estamos seguros de cómo lo maneja el backend por defecto
        const dataToSend = {
            ...formData,
            bodega_ecommerce: formData.bodega_ecommerce ? 1 : 0, 
        };

        if (isEditing) {
            router.put(route('bodegas.update', formData.id), dataToSend, {
                onSuccess: () => setIsOpen(false),
            });
        } else {
            router.post(route('bodegas.store'), dataToSend, {
                onSuccess: () => setIsOpen(false),
            });
        }
    };

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
        // Pasamos la función al meta para usarla en columns
        meta: {
            handleEdit: openEditModal, 
        }
    })

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 min-h-screen">
            <Head title="Bodegas" />

            {/* ENCABEZADO SUPERIOR */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-2">
                <div>
                    <h2 className="font-bold text-2xl text-gray-800 leading-tight tracking-tight">
                        Bodegas
                    </h2>
                </div>
                
                <Button 
                    onClick={openCreateModal}
                    className="bg-[#fc542c] hover:bg-[#fc542c]/90 text-white shadow-sm border-0 rounded-md h-10 px-6 font-medium transition-all"
                >
                    <div className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Crear Bodega
                    </div>
                </Button>
            </div>

            {flash?.message && (
                <div className="p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-sm shadow-sm animate-in fade-in slide-in-from-top-2">
                    {flash.message}
                </div>
            )}

            {/* --- BUSCADOR --- */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="relative w-full">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <Search className="h-4 w-4" />
                    </div>
                    <Input
                        placeholder="Buscar bodegas por código, descripción o dirección..."
                        value={globalFilter ?? ""}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="pl-10 h-11 bg-white border-gray-200 focus-visible:ring-[#fc542c]/20 focus-visible:border-[#fc542c] rounded-lg transition-all"
                    />
                </div>
            </div>
            
            {/* --- TABLA DE DATOS --- */}
            {/* **AJUSTE PRINCIPAL: Eliminar w-full y overflow-auto, dejando que el contenedor flexible maneje el ancho** */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <Table> 
                <TableHeader className="bg-gray-50/50">
                    {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id} className="hover:bg-transparent border-b border-gray-100">
                        {headerGroup.headers.map((header) => {
                        return (
                            <TableHead key={header.id} className="h-12 px-6 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                            {header.isPlaceholder
                                ? null
                                : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                            </TableHead>
                        )
                        })}
                    </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                        <TableRow
                        key={row.id}
                        className="hover:bg-orange-50/30 border-b border-gray-100 transition-colors"
                        >
                        {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id} className="px-6 py-4">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                        ))}
                        </TableRow>
                    ))
                    ) : (
                    <TableRow>
                        <TableCell
                        colSpan={columns.length}
                        className="h-32 text-center text-gray-400"
                        >
                            <div className="flex flex-col items-center justify-center gap-2">
                                <Warehouse className="h-8 w-8 opacity-20" />
                                <p>No hay bodegas registradas.</p>
                            </div>
                        </TableCell>
                    </TableRow>
                    )}
                </TableBody>
                </Table>
                
                {/* PIE DE PAGINA (Solo se muestra si hay paginación del backend) */}
                {(prev_page_url || next_page_url) && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/30">
                        <div className="text-gray-500 text-sm">
                            {total && <span>Total: <strong>{total}</strong></span>}
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" disabled={!prev_page_url} asChild className="border-gray-200 text-gray-600">
                                <Link href={prev_page_url ?? '#'}>Anterior</Link>
                            </Button>
                            <Button variant="outline" size="sm" disabled={!next_page_url} asChild className="border-gray-200 text-gray-600">
                                <Link href={next_page_url ?? '#'}>Siguiente</Link>
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* --- DIALOG (MODAL) ESTILIZADO --- */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[500px] bg-white border border-gray-200 shadow-lg">
                    <DialogHeader>
                        <DialogTitle className="text-gray-800">
                            {isEditing ? 'Editar Bodega' : 'Crear Nueva Bodega'}
                        </DialogTitle>
                        <DialogDescription className="text-gray-500">
                            {isEditing 
                                ? 'Modifica los datos de la bodega seleccionada.' 
                                : 'Ingresa la información para registrar una nueva bodega.'}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSave} className="grid gap-4 py-4">
                        
                        {/* CÓDIGO */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="codigo" className="text-right text-gray-600">Código</Label>
                            <div className="col-span-3">
                                <Input 
                                    id="codigo" 
                                    value={formData.codigo} 
                                    onChange={(e) => setData('codigo', e.target.value.toUpperCase())}
                                    className="border-gray-200 shadow-sm focus-visible:ring-[#fc542c]/20 focus-visible:border-[#fc542c]"
                                    placeholder="Ej. BP (Máx 20 caracteres)"
                                    maxLength={20}
                                />
                                {errors.codigo && <span className="text-red-500 text-xs block mt-1">{errors.codigo}</span>}
                            </div>
                        </div>
                        
                        {/* DESCRIPCIÓN */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="descripcion" className="text-right text-gray-600">Descripción</Label>
                            <div className="col-span-3">
                                <Input 
                                    id="descripcion" 
                                    value={formData.descripcion} 
                                    onChange={(e) => setData('descripcion', e.target.value)}
                                    className="border-gray-200 shadow-sm focus-visible:ring-[#fc542c]/20 focus-visible:border-[#fc542c]"
                                    placeholder="Ej. BODEGA PRINCIPAL"
                                    maxLength={150}
                                />
                                {errors.descripcion && <span className="text-red-500 text-xs block mt-1">{errors.descripcion}</span>}
                            </div>
                        </div>

                        {/* DIRECCIÓN */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="direccion" className="text-right text-gray-600">Dirección</Label>
                            <div className="col-span-3">
                                <Input 
                                    id="direccion" 
                                    value={formData.direccion} 
                                    onChange={(e) => setData('direccion', e.target.value)}
                                    className="border-gray-200 shadow-sm focus-visible:ring-[#fc542c]/20 focus-visible:border-[#fc542c]"
                                    placeholder="Dirección física completa (Opcional)"
                                    maxLength={255}
                                />
                                {errors.direccion && <span className="text-red-500 text-xs block mt-1">{errors.direccion}</span>}
                            </div>
                        </div>

                        {/* BODEGA E-COMMERCE (BOOLEAN) */}
                        <div className="grid grid-cols-4 items-start gap-4 pt-2">
                            <Label htmlFor="bodega_ecommerce" className="text-right text-gray-600 pt-1">E-commerce</Label>
                            <div className="col-span-3 flex items-center space-x-2">
                                <Checkbox
                                    id="bodega_ecommerce"
                                    checked={formData.bodega_ecommerce}
                                    onCheckedChange={(checked) => setData('bodega_ecommerce', checked)}
                                    className="border-gray-300 focus:ring-[#fc542c] data-[state=checked]:bg-[#fc542c] data-[state=checked]:text-white"
                                />
                                <label
                                    htmlFor="bodega_ecommerce"
                                    className="text-sm font-medium leading-none text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    ¿Es una bodega destinada para E-commerce?
                                </label>
                            </div>
                            {errors.bodega_ecommerce && <span className="text-red-500 text-xs block mt-1 col-start-2 col-span-3">{errors.bodega_ecommerce}</span>}
                        </div>

                        <DialogFooter className="mt-4">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setIsOpen(false)} 
                                className="border-gray-200 text-gray-700 hover:bg-gray-50"
                            >
                                Cancelar
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={processing}
                                className="bg-[#fc542c] hover:bg-[#fc542c]/90 text-white shadow-sm"
                            >
                                {processing ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Guardar')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

        </div>
    );
}

Index.layout = page => <AppLayout children={page} />;