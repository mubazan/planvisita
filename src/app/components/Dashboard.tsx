"use client";

import { Cliente, Visita, Metricas } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Users, Calendar, TrendingUp, DollarSign, CheckCircle, Clock } from 'lucide-react';
import { ResumoVisitas } from './ResumoVisitas';

interface DashboardProps {
  clientes: Cliente[];
  visitas: Visita[];
}

export function Dashboard({ clientes, visitas }: DashboardProps) {
  const metricas: Metricas = {
    totalClientes: clientes.length,
    clientesAtivos: clientes.filter(c => c.status === 'ativo').length,
    visitasRealizadas: visitas.filter(v => v.status === 'realizada').length,
    visitasAgendadas: visitas.filter(v => v.status === 'agendada').length,
    valorTotalNegociado: visitas
      .filter(v => v.valorNegociado)
      .reduce((acc, v) => acc + (v.valorNegociado || 0), 0),
    taxaConversao: visitas.length > 0 
      ? (visitas.filter(v => v.status === 'realizada' && v.valorNegociado).length / visitas.length) * 100 
      : 0,
  };

  const proximasVisitas = visitas
    .filter(v => v.status === 'agendada')
    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
    .slice(0, 5);

  const ultimasVisitas = visitas
    .filter(v => v.status === 'realizada')
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Métricas principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total de Clientes</p>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-2">{metricas.totalClientes}</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">{metricas.clientesAtivos} ativos</p>
            </div>
            <Users className="w-12 h-12 text-blue-500 opacity-80" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">Visitas Realizadas</p>
              <p className="text-3xl font-bold text-green-900 dark:text-green-100 mt-2">{metricas.visitasRealizadas}</p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">{metricas.visitasAgendadas} agendadas</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-500 opacity-80" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Valor Negociado</p>
              <p className="text-3xl font-bold text-purple-900 dark:text-purple-100 mt-2">
                R$ {metricas.valorTotalNegociado.toLocaleString('pt-BR')}
              </p>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                Taxa: {metricas.taxaConversao.toFixed(1)}%
              </p>
            </div>
            <DollarSign className="w-12 h-12 text-purple-500 opacity-80" />
          </div>
        </Card>
      </div>

      {/* Resumo Automático de Visitas */}
      <ResumoVisitas visitas={visitas} />

      {/* Próximas visitas e últimas visitas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximas visitas */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-semibold">Próximas Visitas</h3>
          </div>
          {proximasVisitas.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma visita agendada</p>
          ) : (
            <div className="space-y-3">
              {proximasVisitas.map((visita) => (
                <div key={visita.id} className="flex items-start gap-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800">
                  <Calendar className="w-5 h-5 text-orange-500 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{visita.clienteNome}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(visita.data).toLocaleDateString('pt-BR')} às {visita.horario}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{visita.objetivo}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Últimas visitas realizadas */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-semibold">Últimas Visitas</h3>
          </div>
          {ultimasVisitas.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma visita realizada</p>
          ) : (
            <div className="space-y-3">
              {ultimasVisitas.map((visita) => (
                <div key={visita.id} className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{visita.clienteNome}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(visita.data).toLocaleDateString('pt-BR')}
                    </p>
                    {visita.valorNegociado && (
                      <p className="text-xs font-medium text-green-600 dark:text-green-400 mt-1">
                        R$ {visita.valorNegociado.toLocaleString('pt-BR')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
