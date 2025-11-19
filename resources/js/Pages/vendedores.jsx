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
  User,
  Store
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

/**
 * Definición de Columnas
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
    cell: ({ row }) => <div className="font-medium text-gray-700">#{row.getValue("id")}</div>,
  },
  {
    accessorKey: "descripcion",
    header: "Descripción (Rol)",
    cell: ({ row }) => (
        <div className="font-medium text-gray-800">
            {row.getValue("descripcion")}
        </div>
    ),
  },
  {
    accessorKey: "usuario",
    header: "Usuario",
    cell: ({ row }) => (
        <div className="flex items-center gap-2 text-gray-600">
            <User className="h-4 w-4 text-gray-400" />
            {row.getValue("usuario")}
        </div>
    ),
  },
  {
    accessorKey: "sucursal",
    header: "Sucursal",
    cell: ({ row }) => (
        <div className="flex items-center gap-2 text-gray-600">
            <Store className="h-4 w-4 text-gray-400" />
            {row.getValue("sucursal")}
        </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row, table }) => {
      const vendedor = row.original

      return (
        <div className="flex items-center justify-end">
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button 
                    variant="ghost" 
                    className="h-8 w-8 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none hover:bg-gray-100 text-gray-500"
                >
                <span className="sr-only">Abrir menú</span>
                <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="bg-white border border-gray-100 shadow-lg z-50 w-48">
                <DropdownMenuLabel className="text-gray-500 text-xs uppercase tracking-wider">Acciones</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-100" />
                
                <DropdownMenuItem 
                    onClick={() => table.options.meta?.handleEdit(vendedor)}
                    className="cursor-pointer hover:bg-gray-50 text-gray-700"
                >
                    Editar Vendedor
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild className="cursor-pointer hover:bg-red-50 text-red-600 focus:text-red-600">
                    <Link
                        href={route('vendedores.destroy', vendedor.id)}
                        method="delete"
                        as="button"
                        onBefore={() => confirm('¿Estás seguro de eliminar este vendedor?')}
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
// 1. AGREGAMOS 'filters' A LAS PROPS
export default function Index({ auth, vendedores, filters }) {
  const { flash } = usePage().props;

  // Manejo flexible de datos (si viene paginado o como array simple)
  const data = Array.isArray(vendedores) ? vendedores : (vendedores?.data || []);
  const { next_page_url, prev_page_url, total } = vendedores?.paginator || vendedores || {};

  // --- ESTADOS DE TABLA ---
  const [sorting, setSorting] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState([])
  
  // 2. INICIALIZAMOS CON EL FILTRO QUE VIENE DEL SERVIDOR
  const [globalFilter, setGlobalFilter] = React.useState(filters?.search || '')

  // --- 3. LOGICA DEL BUSCADOR (MOTOR) ---
  React.useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (globalFilter !== (filters?.search || '')) {
        doSearch(globalFilter);
      }
    }, 500); // 500ms de espera

    return () => clearTimeout(delayDebounceFn);
  }, [globalFilter]);

  const doSearch = (search) => {
    router.get(
      route('vendedores.index'),
      { search: search },
      { 
        preserveState: true,
        preserveScroll: true,
        replace: true 
      }
    );
  };
  // --------------------------------------

  // --- ESTADOS DEL DIALOG Y FORMULARIO ---
  const [isOpen, setIsOpen] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);

  // Hook useForm de Inertia
  const { data: formData, setData, post, put, processing, errors, reset, clearErrors } = useForm({
    id: '',
    descripcion: '',
    usuario: '',
    sucursal: '',
  });

  // --- FUNCIONES DE CONTROL DEL MODAL ---
  const openCreateModal = () => {
    setIsEditing(false);
    reset();
    clearErrors();
    setIsOpen(true);
  };

  const openEditModal = (vendedor) => {
    setIsEditing(true);
    clearErrors();
    setData({
        id: vendedor.id,
        descripcion: vendedor.descripcion,
        usuario: vendedor.usuario,
        sucursal: vendedor.sucursal,
    });
    setIsOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (isEditing) {
        put(route('vendedores.update', formData.id), {
            onSuccess: () => setIsOpen(false),
        });
    } else {
        post(route('vendedores.store'), {
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
        <Head title="Vendedores" />

        {/* ENCABEZADO SUPERIOR */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-2">
            <div>
                <h2 className="font-bold text-2xl text-gray-800 leading-tight tracking-tight">
                    Vendedores
                </h2>
            </div>
            
            <Button 
                onClick={openCreateModal}
                className="bg-[#fc542c] hover:bg-[#fc542c]/90 text-white shadow-sm border-0 rounded-md h-10 px-6 font-medium transition-all"
            >
                <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Crear Vendedor
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
                    placeholder="Buscar vendedores..."
                    value={globalFilter ?? ""}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="pl-10 h-11 bg-white border-gray-200 focus-visible:ring-[#fc542c]/20 focus-visible:border-[#fc542c] rounded-lg transition-all"
                />
            </div>
        </div>
        
        {/* --- TABLA DE DATOS --- */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="relative w-full overflow-auto">
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
                                <User className="h-8 w-8 opacity-20" />
                                <p>No hay vendedores registrados.</p>
                            </div>
                        </TableCell>
                    </TableRow>
                    )}
                </TableBody>
                </Table>
            </div>
            
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
                        {isEditing ? 'Editar Vendedor' : 'Crear Nuevo Vendedor'}
                    </DialogTitle>
                    <DialogDescription className="text-gray-500">
                        {isEditing 
                            ? 'Modifica los datos del vendedor.' 
                            : 'Ingresa la información para registrar un nuevo vendedor.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSave} className="grid gap-4 py-4">
                    
                    {/* DESCRIPCIÓN */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="descripcion" className="text-right text-gray-600">Descripción</Label>
                        <div className="col-span-3">
                            <Input 
                                id="descripcion" 
                                value={formData.descripcion} 
                                onChange={(e) => setData('descripcion', e.target.value)}
                                className="border-gray-200 shadow-sm focus-visible:ring-[#fc542c]/20 focus-visible:border-[#fc542c]"
                                placeholder="Ej. Vendedor Junior"
                            />
                            {errors.descripcion && <span className="text-red-500 text-xs block mt-1">{errors.descripcion}</span>}
                        </div>
                    </div>

                    {/* USUARIO */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="usuario" className="text-right text-gray-600">Usuario</Label>
                        <div className="col-span-3">
                            <Input 
                                id="usuario" 
                                value={formData.usuario} 
                                onChange={(e) => setData('usuario', e.target.value)}
                                className="border-gray-200 shadow-sm focus-visible:ring-[#fc542c]/20 focus-visible:border-[#fc542c]"
                                placeholder="Ej. juan.perez"
                            />
                            {errors.usuario && <span className="text-red-500 text-xs block mt-1">{errors.usuario}</span>}
                        </div>
                    </div>

                    {/* SUCURSAL */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="sucursal" className="text-right text-gray-600">Sucursal</Label>
                        <div className="col-span-3">
                            <Input 
                                id="sucursal" 
                                value={formData.sucursal} 
                                onChange={(e) => setData('sucursal', e.target.value)}
                                className="border-gray-200 shadow-sm focus-visible:ring-[#fc542c]/20 focus-visible:border-[#fc542c]"
                                placeholder="Ej. Centro"
                            />
                             {errors.sucursal && <span className="text-red-500 text-xs block mt-1">{errors.sucursal}</span>}
                        </div>
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