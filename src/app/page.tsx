"use client";

import { useState } from 'react';
import { Cliente, Visita } from '@/lib/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dashboard } from './components/Dashboard';
import { Clientes } from './components/Clientes';
import { Visitas } from './components/Visitas';
import { Agenda } from './components/Agenda';
import { Rotas } from './components/Rotas';
import { LayoutDashboard, Users, Calendar, ClipboardList, Briefcase, Navigation } from 'lucide-react';

export default function Home() {
  const [clientes, setClientes, clientesLoaded] = useLocalStorage<Cliente[]>('repRoute_clientes', []);
  const [visitas, setVisitas, visitasLoaded] = useLocalStorage<Visita[]>('repRoute_visitas', []);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Handlers para Clientes
  const handleAddCliente = (clienteData: Omit<Cliente, 'id' | 'criadoEm'>) => {
    const novoCliente: Cliente = {
      ...clienteData,
      id: crypto.randomUUID(),
      criadoEm: new Date().toISOString(),
    };
    setClientes([...clientes, novoCliente]);
  };

  const handleUpdateCliente = (id: string, clienteData: Partial<Cliente>) => {
    setClientes(clientes.map(c => c.id === id ? { ...c, ...clienteData } : c));
  };

  const handleDeleteCliente = (id: string) => {
    setClientes(clientes.filter(c => c.id !== id));
    // Remover visitas do cliente deletado
    setVisitas(visitas.filter(v => v.clienteId !== id));
  };

  // Handlers para Visitas
  const handleAddVisita = (visitaData: Omit<Visita, 'id' | 'criadaEm'>) => {
    const novaVisita: Visita = {
      ...visitaData,
      id: crypto.randomUUID(),
      criadaEm: new Date().toISOString(),
    };
    setVisitas([...visitas, novaVisita]);
  };

  const handleUpdateVisita = (id: string, visitaData: Partial<Visita>) => {
    setVisitas(visitas.map(v => v.id === id ? { ...v, ...visitaData } : v));
  };

  const handleDeleteVisita = (id: string) => {
    setVisitas(visitas.filter(v => v.id !== id));
  };

  if (!clientesLoaded || !visitasLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Briefcase className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PlanVisita
              </h1>
              <p className="text-xs text-muted-foreground">Gestão de Vendas e Visitas</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with Background Image */}
      <main 
        className="container mx-auto px-4 py-6 relative"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920&h=1080&fit=crop&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Overlay para melhorar legibilidade */}
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"></div>
        
        {/* Content com z-index para ficar acima do overlay */}
        <div className="relative z-10">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 h-auto gap-2 bg-transparent">
              <TabsTrigger 
                value="dashboard" 
                className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-md py-3"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger 
                value="clientes"
                className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-md py-3"
              >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Clientes</span>
              </TabsTrigger>
              <TabsTrigger 
                value="visitas"
                className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-md py-3"
              >
                <ClipboardList className="w-4 h-4" />
                <span className="hidden sm:inline">Visitas</span>
              </TabsTrigger>
              <TabsTrigger 
                value="agenda"
                className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-md py-3"
              >
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Agenda</span>
              </TabsTrigger>
              <TabsTrigger 
                value="rotas"
                className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-md py-3"
              >
                <Navigation className="w-4 h-4" />
                <span className="hidden sm:inline">Rotas</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="mt-6">
              <Dashboard clientes={clientes} visitas={visitas} />
            </TabsContent>

            <TabsContent value="clientes" className="mt-6">
              <Clientes
                clientes={clientes}
                onAddCliente={handleAddCliente}
                onUpdateCliente={handleUpdateCliente}
                onDeleteCliente={handleDeleteCliente}
              />
            </TabsContent>

            <TabsContent value="visitas" className="mt-6">
              <Visitas
                visitas={visitas}
                clientes={clientes}
                onAddVisita={handleAddVisita}
                onUpdateVisita={handleUpdateVisita}
                onDeleteVisita={handleDeleteVisita}
              />
            </TabsContent>

            <TabsContent value="agenda" className="mt-6">
              <Agenda visitas={visitas} />
            </TabsContent>

            <TabsContent value="rotas" className="mt-6">
              <Rotas clientes={clientes} visitas={visitas} />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>PlanVisita - Gestão Inteligente de Vendas</p>
            <p className="mt-1">Todos os dados são salvos localmente no seu navegador</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
