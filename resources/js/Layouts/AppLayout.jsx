
import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Importamos todos los iconos que necesitamos
import { 
  Menu, HelpCircle, CreditCard, Star, CircleUser, LayoutDashboard, Users, 
  Settings, LogOut, KeyRound, Home, Building, Box, GraduationCap, Warehouse, 
  DollarSign, Globe, Laptop, Banknote, GlassWater, ShoppingCart, 
  ClipboardList, ShoppingBag, BarChart, Percent, File, Wrench, Lock, Phone,
  ChevronRight
} from 'lucide-react';

// --- 1. COMPONENTES DEL SIDEBAR ---

// El logo (simplificado) para cuando el menú está colapsado
function AppLogoIcon() {
  return (
    <div className="flex items-center justify-center p-2">
      <img 
        src="/avatar5.png" 
        alt="Logo" 
        className="h-8 w-8" 
      />
    </div>
  );
}

// Perfil de usuario para la parte superior del menú expandido
function SidebarUserProfile({ isCollapsed }) {
  if (isCollapsed) {
    return <AppLogoIcon />;
  }
  return (
    <div className="flex items-center gap-3 p-4">
      <img 
        src="/avatar5.png"
        alt="Avatar" 
        className="h-10 w-10" 
      />
      <div>
        <span className="font-semibold text-white">Bicom Test</span>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-xs text-green-300">Conectado</span>
        </div>
      </div>
    </div>
  );
}

// Cabecera de sección ("Menú Principal")
function SidebarSectionHeader({ isCollapsed, title }) {
  if (isCollapsed) return ;
  return (
    <h3 className="px-4 py-2 text-xs font-semibold uppercase text-white/50">{title}</h3>
  );
}

// Enlace simple (con soporte para badges)
function SidebarLink({ href, icon: Icon, label, isCollapsed, badgeText }) {
  const badgeColor = badgeText === "NUEVO" ? "bg-green-500 text-white" : "bg-red-600 text-white";
  return (
    <Button asChild variant="ghost" className={`w-full text-white hover:bg-white/10 hover:text-white ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
      <Link href={href}>
        <div className="flex items-center">
          <Icon className={`h-5 w-5 ${!isCollapsed ? 'mr-3' : ''}`} />
          {!isCollapsed && <span>{label}</span>}
        </div>
        {!isCollapsed && badgeText && 
          <Badge className={badgeColor}>{badgeText}</Badge>
        }
      </Link>
    </Button>
  );
}

// Enlace "Bloqueado" (no es un enlace)
function SidebarLockedItem({ icon: Icon, label, isCollapsed, badgeText }) {
  if (isCollapsed) {
    return (
      <div className="relative flex justify-center items-center h-10 w-full text-white/50" title={label}>
        <Icon className="h-5 w-5" />
        <Lock className="absolute h-3 w-3 bottom-1 right-1 p-0.5 bg-[#2b4056] rounded-full" />
      </div>
    );
  }
  
  const badgeColor = badgeText === "NUEVO" ? "bg-green-500 text-white" : "bg-red-600 text-white";
  
  return (
    <div className="px-4 py-3 text-white/70">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Icon className="mr-3 h-5 w-5" />
          <span className="font-semibold">{label}</span>
        </div>
        {badgeText && <Badge className={badgeColor}>{badgeText}</Badge>}
      </div>
      <div className="flex items-center justify-between mt-1.5 pl-[2.125rem]">
        <p className="text-xs text-white/50 flex items-center">
          Si deseas contratar contáctanos.
        </p>
        <div className="flex items-center gap-2 text-white/50">
           <Phone className="h-4 w-4" />
           <Lock className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

// Enlace Colapsable (para submenús)
function SidebarCollapsible({ icon: Icon, label, isCollapsed, children }) {
  if (isCollapsed) {
    return (
      <Button variant="ghost" size="icon" className="w-full justify-center text-white hover:bg-white/10 hover:text-white" title={label}>
        <Icon className="h-5 w-5" />
      </Button>
    );
  }
  return (
    <Collapsible className="w-full">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between text-white hover:bg-white/10 hover:text-white">
          <div className="flex items-center">
            <Icon className="mr-3 h-5 w-5" />
            <span>{label}</span>
          </div>
          <ChevronRight className="h-4 w-4 transition-transform data-[state=open]:rotate-90" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-8 py-1 space-y-1 bg-black/20">
        {/* Aquí puedes poner <SidebarSubLink> o <Button> simples */}
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

// Enlace simple para dentro de un colapsable
function SidebarSubLink({ href, label }) {
  return (
    <Button asChild variant="ghost" size="sm" className="w-full justify-start text-white/80 hover:bg-white/10 hover:text-white">
      <Link href={href}>{label}</Link>
    </Button>
  );
}


// --- 2. LAYOUT PRINCIPAL ---

export default function AppLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const menuBg = 'bg-[#2b4056]';

  return (
    <div className="flex h-screen bg-background">
      
      {/* --- SIDEBAR --- */}
      <aside 
        className={`flex flex-col flex-shrink-0 ${menuBg} transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}
      >
        {/* Sección Superior del Sidebar (Perfil) */}
        <div >
          <SidebarUserProfile isCollapsed={!isSidebarOpen} />
        </div>
        
        {/* Sección Principal del Sidebar (Navegación con scroll) */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 space-y-1">
          <SidebarSectionHeader isCollapsed={!isSidebarOpen} title="Menú Principal" />
          
          <SidebarLink href="#" icon={Home} label="Inicio" isCollapsed={!isSidebarOpen} />
          <SidebarLink href="#" icon={Building} label="Mi Empresa" isCollapsed={!isSidebarOpen} />
          <SidebarLink href="#" icon={Box} label="Mi Stock" isCollapsed={!isSidebarOpen} />
          <SidebarLink href="#" icon={GraduationCap} label="Academia Bicom" isCollapsed={!isSidebarOpen} badgeText="NUEVO" />

          <SidebarCollapsible icon={Warehouse} label="Bodega" isCollapsed={!isSidebarOpen}>
            <SidebarSubLink href={route('productos.index')} label="Productos" />
          </SidebarCollapsible>

          <SidebarCollapsible icon={DollarSign} label="Ventas" isCollapsed={!isSidebarOpen}>
          </SidebarCollapsible>

          <SidebarLockedItem icon={Globe} label="Exportaciones" isCollapsed={!isSidebarOpen} badgeText="NUEVO" />
          
          <SidebarCollapsible icon={Laptop} label="Punto de Venta" isCollapsed={!isSidebarOpen}>
          </SidebarCollapsible>

          {/* Items Bloqueados */}
          <SidebarLockedItem icon={CreditCard} label="Transbank Integrado" isCollapsed={!isSidebarOpen} />
          <SidebarLockedItem icon={Banknote} label="Bci Pagos Integrado" isCollapsed={!isSidebarOpen} />
          <SidebarLockedItem icon={GlassWater} label="BiGourmet" isCollapsed={!isSidebarOpen} />
          <SidebarLockedItem icon={ShoppingCart} label="Ecommerce" isCollapsed={!isSidebarOpen} />
          <SidebarLockedItem icon={Users} label="Socios Comerciales" isCollapsed={!isSidebarOpen} />
          <SidebarLockedItem icon={ClipboardList} label="Órdenes de Compra" isCollapsed={!isSidebarOpen} />

          <SidebarCollapsible icon={ShoppingBag} label="Compras" isCollapsed={!isSidebarOpen}>
          </SidebarCollapsible>

          <SidebarCollapsible icon={Banknote} label="Tesorería" isCollapsed={!isSidebarOpen}>
          </SidebarCollapsible>

          <SidebarCollapsible icon={BarChart} label="Informes" isCollapsed={!isSidebarOpen}>
          </SidebarCollapsible>
          
          <SidebarCollapsible icon={Percent} label="Promociones" isCollapsed={!isSidebarOpen}>
          </SidebarCollapsible>

          <SidebarCollapsible icon={File} label="Archivos Maestros" isCollapsed={!isSidebarOpen}>
            <SidebarSubLink href={route('vendedores.index')} label="Vendedores" />
            <SidebarSubLink href={route('bodegas.index')} label="Bodegas" />
          </SidebarCollapsible>
          
          <SidebarCollapsible icon={Settings} label="Configuración" isCollapsed={!isSidebarOpen}>
          </SidebarCollapsible>

          <SidebarLink href="#" icon={Wrench} label="Soportistas" isCollapsed={!isSidebarOpen} />

        </nav>
      </aside>

      {/* --- ÁREA PRINCIPAL (DERECHA) --- */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        
        {/* --- HEADER --- */}
        <header className={`flex h-16 items-center justify-between p-4 text-white ${menuBg} flex-shrink-0`}>
          
          {/* Sección Izquierda: Toggle y Nombre */}
          <div className="flex items-center gap-4">
            <Button 
              size="icon" 
              variant="ghost" 
              className="text-white hover:bg-white/10 hover:text-white"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <span className="font-semibold">Bicom Test</span>
          </div>

          {/* Sección Derecha: Iconos, Moneda y Perfil */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
              <HelpCircle className="mr-2 h-5 w-5" />
              Mesa de Ayuda
            </Button>
            <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
              <CreditCard className="mr-2 h-5 w-5" />
              Pagos
            </Button>
            <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
              <Star className="mr-2 h-5 w-5" />
              Soporte
            </Button>

            <div className="flex gap-4 border-l border-r border-white/30 px-4">
              <span className="font-semibold">$UF: 39643.59</span>
              <span className="font-semibold">$USD: 932.63</span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 text-white hover:bg-white/10 hover:text-white">
                  <CircleUser className="h-6 w-6" />
                  soporte
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className={`w-64 border-none p-0 ${menuBg}`} align="end">
                <DropdownMenuLabel className="flex flex-col items-center p-4">
                  <CircleUser className="h-16 w-16 text-white mb-2" />
                  <span className="text-lg font-semibold text-white">soporte</span>
                  <span className="text-xs text-white/80">Fecha 17-11-2025 11:01:56</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/20 m-0" />
                <div className="p-2">
                  <DropdownMenuItem className="p-0 focus:bg-transparent">
                    <Button className="w-full justify-center bg-blue-500 hover:bg-blue-600 text-white">
                      <KeyRound className="mr-2 h-4 w-4" />
                      Cambiar Contraseña
                    </Button>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="p-0 mt-1 focus:bg-transparent">
                    <Button variant="destructive" className="w-full justify-center">
                      <LogOut className="mr-2 h-4 w-4" />
                      Salir del Sistema
                    </Button>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* --- CONTENIDO DE LA PÁGINA --- */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}