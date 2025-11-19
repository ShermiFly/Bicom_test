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
  Search,// <--- BUSCADOR
  Plus,
  AlertTriangleIcon 
} from "lucide-react"

// Componentes de shadcn/ui
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
 * Función de formateo de peso
 */
const formatCurrency = (number) => {
    // parseFloat intenta convertirlo a un número real flotante.
    const value = parseFloat(number);

    // Si el valor no es un número (ej: viene null o es un "texto"), 
    // devolvemos "$ 0" para que la interfaz no se rompa mostrando "NaN".
    if (isNaN(value)) return "$ 0";

    // Creamos una instancia de Intl.NumberFormat configurada para Chile ('es-CL').
    const formattedNumber = new Intl.NumberFormat('es-CL', {
        style: 'decimal',  //da el número con formato, sin signos.
        minimumFractionDigits: 0, //No queremos decimales.
        maximumFractionDigits: 0, //Forzamos a redondear si hubiera decimales.
    }).format(value);

    // Tomamos el número y le pegamos manualmente el signo "$ ".
    return `$ ${formattedNumber}`;
};

/**
 * Definición de Columnas
 */
export const columns = [
  {
    accessorKey: "codigo",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4 hover:bg-gray-100"
        >
          Código
          <ArrowUpDown className="ml-2 h-4 w-4 text-gray-400" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium h-16 flex items-center text-gray-700">{row.getValue("codigo")}</div>,
  },
  {
    accessorKey: "descripcion",
    header: "Descripción",
    cell: ({ row }) => (
        <div className="h-16 flex items-center text-sm text-gray-500">
            {row.getValue("descripcion")}
        </div>
    ),
  },
  {
    //Clave de acceso: Conecta esta columna con la propiedad "precio_neto"
    accessorKey: "precio_neto",
    // Se usa esta función para retornar JSX y alinear el texto a la derecha
    header: () => <div className="text-right">P. Neto</div>,
    // Desestructuramos { row } para acceder a los datos de la fila actual.
    cell: ({ row }) => {
      // 1. Obtener el valor crudo de la columna "precio_neto".
      // 2. parseFloat asegura que sea un número para evitar errores de formato.
      const amount = parseFloat(row.getValue("precio_neto"))
      return <div className="text-right font-medium h-16 flex items-center justify-end text-gray-700">{formatCurrency(amount)}</div>
    },
  },
  {
    accessorKey: "precio_bruto",
    header: () => <div className="text-right">P. Bruto</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("precio_bruto"))
      return <div className="text-right text-gray-500 h-16 flex items-center justify-end">{formatCurrency(amount)}</div>
    },
  },
  {
    accessorKey: "activo",
    header: "Estado",
    cell: ({ row }) => {
      const isActivo = !!row.getValue("activo"); 
      return (
        <div className="h-16 flex items-center">
            {isActivo ? (
                <Badge 
                    variant="outline" 
                    className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                >
                    Activo
                </Badge>
            ) : (
                <Badge 
                    variant="outline" 
                    className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                >
                    Inactivo
                </Badge>
            )}
        </div>
      )
    },
  },
  {
    id: "actions",
    // Esto evita que el usuario pueda ocultar esta columna desde el menú de "Vistas".
    // Es importante para que los botones de editar/Borrar estén siempre visibles.
    enableHiding: false,
    cell: ({ row, table }) => { 
      //row.original accede al OBJETO COMPLETO de la base de datos.
      const producto = row.original

      return (
        <div className="h-16 flex items-center justify-end">
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
                    // 1. table.options.meta: Es un "bolsillo" especial donde guardamos funciones externas.
                    onClick={() => table.options.meta?.handleEdit(producto)}
                    className="cursor-pointer hover:bg-gray-50 focus:bg-gray-50 text-gray-700"
                >
                    Editar Producto
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                    onClick={() => table.options.meta?.handleDelete(producto)}
                    className="cursor-pointer hover:bg-red-50 focus:bg-red-50 text-red-600 focus:text-red-600"
                >
                    Eliminar
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
export default function Index({ auth, productos, filters }) {
  // Accedemos a las props globales de la página (Shared Data).
  // 'flash' contiene mensajes de éxito/error.
  const { flash } = usePage().props;

  // Traemos 'paginator' y 'total' de "ProductoRepository"
  // "|| {}": si 'productos' llega nulo, usa un objeto vacío 
  // para que la página no se rompa.
  const { paginator, total } = productos || {};
  const { data = [], next_page_url, prev_page_url } = paginator || {};

  // --- ESTADOS DE TABLA ---
  const [searchTerm, setSearchTerm] = React.useState(filters?.search || '');
  const [statusFilter, setStatusFilter] = React.useState(filters?.status || 'all');

  const [sorting, setSorting] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState([])
  const [columnVisibility, setColumnVisibility] = React.useState({})

  // --- ESTADOS DEL DIALOG (CREAR/EDITAR) ---
  const [isOpen, setIsOpen] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);

  // --- ESTADOS DEL DIALOG (ELIMINAR) ---
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [productToDelete, setProductToDelete] = React.useState(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // useForm de Inertia
  // Este hook maneja todo el ciclo de vida del formulario (estado, envío, errores, carga).
  const { data: formData, setData, post, put, processing, errors, reset, clearErrors } = useForm({
    id: '',
    codigo: '',
    descripcion: '',
    precio_neto: '',
    precio_bruto: '',
    activo: '1',
  });

  // --- FUNCIONES DE CONTROL DEL MODAL (CREAR/EDITAR) ---
  const openCreateModal = () => {
    setIsEditing(false);
    reset();
    clearErrors();
    setIsOpen(true);
  };

  //MODAL DE EDICION DEL PRODUCTO
  const openEditModal = (producto) => {
    setIsEditing(true);
    clearErrors();
    setData({
        id: producto.id,
        codigo: producto.codigo,
        descripcion: producto.descripcion,
        precio_neto: producto.precio_neto,
        precio_bruto: producto.precio_bruto,
        activo: producto.activo ? '1' : '0',
    });
    setIsOpen(true);
  };

  //GUARDADO DEL PRODUCTO
  const handleSave = (e) => {
    e.preventDefault();
    if (isEditing) {
        put(route('productos.update', formData.id), {
            onSuccess: () => setIsOpen(false),
        });
    } else {
        post(route('productos.store'), {
            onSuccess: () => setIsOpen(false),
        });
    }
  };

  // --- FUNCIONES DE CONTROL DEL MODAL (ELIMINAR) ---
  const openDeleteModal = (producto) => {
    setProductToDelete(producto);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (!productToDelete) return;
    
    setIsDeleting(true);
    // Usamos router.delete directamente ya que no necesitamos un form completo
    router.delete(route('productos.destroy', productToDelete.id), {
        preserveScroll: true,
        onSuccess: () => {
            setIsDeleteOpen(false);
            setProductToDelete(null);
            setIsDeleting(false);
        },
        onError: () => {
            setIsDeleting(false);
            // Aquí podrías agregar un toast de error si quisieras
        }
    });
  };

  // --- CONFIGURACION DEL BUSCADOR ---
  // Este useEffect escucha cambios en la variable 'searchTerm' (lo que escribe el usuario).
  React.useEffect(() => {
    // Creamos un temporizador. No enviamos la petición inmediatamente, esperamos 500ms.
    const delayDebounceFn = setTimeout(() => {
      // 2. Validación para evitar búsquedas innecesarias:
      // Solo buscamos si el texto actual es DIFERENTE al que ya viene filtrado desde Laravel.
      // Esto evita que al cargar la página se dispare una búsqueda redundante.
      if (searchTerm !== (filters?.search || '')) {
         doSearch(searchTerm, statusFilter);
      }
    }, 500); // Tiempo de espera: medio segundo tras dejar de escribir.

    // Si el usuario escribe otra letra antes de que pasen los 500ms, 
    // React ejecuta esto: cancela el temporizador anterior y empieza uno nuevo.
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const doSearch = (search, status) => {
    // Usamos el router de Inertia para hacer una petición GET (navegación)
    router.get(
      route('productos.index'), // URL destino (usando Ziggy en Laravel)
      { 
        // Parámetros que se añaden a la URL
        search: search, 
        status: status === 'all' ? '' : status
      },
      { 
        preserveState: true,
        preserveScroll: true,
        replace: true 
      }
    );
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    doSearch(searchTerm, value);
  };

  const table = useReactTable({
    data: data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    // AQUÍ PASAMOS LAS FUNCIONES A LAS COLUMNAS EXTERNAS
    meta: {
        handleEdit: openEditModal,
        handleDelete: openDeleteModal, // <--- Nueva función
    }
  })

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 min-h-screen">
        <Head title="Productos" />

        {/* ENCABEZADO SUPERIOR */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-2">
            <div>
                <h2 className="font-bold text-2xl text-gray-800 leading-tight tracking-tight">
                    Productos
                </h2>
            </div>
            
            <Button 
                onClick={openCreateModal}
                className="bg-[#fc542c] hover:bg-[#fc542c]/90 text-white shadow-sm border-0 rounded-md h-10 px-6 font-medium transition-all"
            >
                <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Crear Nuevo
                </div>
            </Button>
        </div>

        {flash?.message && (
            <div className="p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-sm shadow-sm animate-in fade-in slide-in-from-top-2">
                {flash.message}
            </div>
        )}

        {/* --- SECCIÓN DE BUSCADOR Y FILTROS --- */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4 items-center">
                {/* Buscador */}
                <div className="relative w-full md:flex-1">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <Search className="h-4 w-4" />
                    </div>
                    <Input
                        placeholder="Buscar por código o descripción..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-11 bg-white border-gray-200 focus-visible:ring-[#fc542c]/20 focus-visible:border-[#fc542c] rounded-lg transition-all placeholder:text-gray-400"
                    />
                </div>

                {/* Filtro de Estado */}
                <div className="w-full md:w-[200px]">
                    <Select 
                        value={statusFilter} 
                        onValueChange={handleStatusChange}
                    >
                        <SelectTrigger className="h-11 border-gray-200 focus:ring-[#fc542c]/20 focus:border-[#fc542c] rounded-lg bg-white text-gray-600 shadow-sm">
                            <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                        
                        <SelectContent className="bg-white border border-gray-100 shadow-xl z-50">
                            <SelectItem value="all" className="cursor-pointer">Ambos</SelectItem>
                            <SelectItem value="1" className="cursor-pointer">Activos</SelectItem>
                            <SelectItem value="0" className="cursor-pointer">Inactivos</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
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
                            <TableCell key={cell.id} className="px-6">
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
                                <Search className="h-8 w-8 opacity-20" />
                                <p>No se encontraron productos con los criterios actuales.</p>
                            </div>
                        </TableCell>
                    </TableRow>
                    )}
                </TableBody>
                </Table>
            </div>
            
            {/* PIE DE PAGINA */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/30">
                <div className="text-gray-500 text-sm">
                    {total !== undefined ? (
                        <span>
                             Mostrando <strong>{data.length}</strong> de <strong>{total}</strong> resultados
                        </span>
                    ) : (
                        <span>{data.length} resultados</span>
                    )}
                </div>
                
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!prev_page_url}
                        className="border-gray-200 text-gray-600 hover:bg-white hover:text-[#fc542c] hover:border-[#fc542c]/30"
                        asChild
                    >
                        <Link 
                            href={prev_page_url ?? '#'}
                            preserveScroll
                            preserveState
                            only={['productos']}
                        >
                            Anterior
                        </Link>
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!next_page_url}
                        className="border-gray-200 text-gray-600 hover:bg-white hover:text-[#fc542c] hover:border-[#fc542c]/30"
                        asChild
                    >
                        <Link 
                            href={next_page_url ?? '#'}
                            preserveScroll
                            preserveState
                            only={['productos']}
                        >
                            Siguiente
                        </Link>
                    </Button>
                </div>
            </div>
        </div>

        {/* --- DIALOG (MODAL) PARA CREAR/EDITAR --- */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[500px] bg-white border border-gray-200 shadow-lg">
                <DialogHeader>
                    <DialogTitle className="text-gray-800">
                        {isEditing ? 'Editar Producto' : 'Crear Nuevo Producto'}
                    </DialogTitle>
                    <DialogDescription className="text-gray-500">
                        {isEditing 
                            ? 'Realiza cambios en el producto aquí. Haz clic en guardar cuando termines.' 
                            : 'Ingresa los detalles del nuevo producto a continuación.'}
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
                                onChange={(e) => setData('codigo', e.target.value)}
                                className="border-gray-200 shadow-sm focus-visible:ring-[#fc542c]/20 focus-visible:border-[#fc542c]"
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
                            />
                            {errors.descripcion && <span className="text-red-500 text-xs block mt-1">{errors.descripcion}</span>}
                        </div>
                    </div>

                    {/* PRECIO NETO */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="precio_neto" className="text-right text-gray-600">P. Neto</Label>
                        <div className="col-span-3">
                            <Input 
                                id="precio_neto" 
                                type="number" 
                                value={formData.precio_neto} 
                                onChange={(e) => setData('precio_neto', e.target.value)}
                                className="border-gray-200 shadow-sm focus-visible:ring-[#fc542c]/20 focus-visible:border-[#fc542c]"
                            />
                                {errors.precio_neto && <span className="text-red-500 text-xs block mt-1">{errors.precio_neto}</span>}
                        </div>
                    </div>

                    {/* PRECIO BRUTO */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="precio_bruto" className="text-right text-gray-600">P. Bruto</Label>
                        <div className="col-span-3">
                            <Input 
                                id="precio_bruto" 
                                type="number" 
                                value={formData.precio_bruto} 
                                onChange={(e) => setData('precio_bruto', e.target.value)}
                                className="border-gray-200 shadow-sm focus-visible:ring-[#fc542c]/20 focus-visible:border-[#fc542c]"
                            />
                                {errors.precio_bruto && <span className="text-red-500 text-xs block mt-1">{errors.precio_bruto}</span>}
                        </div>
                    </div>

                    {/* ESTADO */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="activo" className="text-right text-gray-600">Estado</Label>
                        <div className="col-span-3">
                            <Select 
                                value={String(formData.activo)} 
                                onValueChange={(val) => setData('activo', val)}
                            >
                                <SelectTrigger className="border-gray-200 shadow-sm focus:ring-[#fc542c]/20 focus:border-[#fc542c]">
                                    <SelectValue placeholder="Selecciona estado" />
                                </SelectTrigger>
                                <SelectContent className="border-gray-200 shadow-lg">
                                    <SelectItem value="1">Activo</SelectItem>
                                    <SelectItem value="0">Inactivo</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.activo && <span className="text-red-500 text-xs block mt-1">{errors.activo}</span>}
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

        {/* --- NUEVO DIALOG DE CONFIRMACIÓN DE ELIMINACIÓN --- */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent className="sm:max-w-lg bg-white border border-gray-200 shadow-xl">
            <div className="flex items-start space-x-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
                <AlertTriangleIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="w-full">
                <DialogHeader>
                  <DialogTitle className="text-gray-800">Eliminar producto</DialogTitle>
                  <DialogDescription className="text-gray-500 mt-2">
                    ¿Estás seguro de que deseas eliminar el producto 
                    <span className="font-medium text-gray-700"> "{productToDelete?.descripcion}"</span>? 
                    <br />
                    Todos los datos serán eliminados permanentemente. Esta acción no se puede deshacer.
                  </DialogDescription>
                </DialogHeader>
              </div>
            </div>
            
            <DialogFooter className="mt-6">
              <Button 
                variant="outline" 
                onClick={() => setIsDeleteOpen(false)}
                disabled={isDeleting}
                className="border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isDeleting ? 'Eliminando...' : 'Eliminar Permanentemente'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

    </div>
  );
}

Index.layout = page => <AppLayout children={page} />;