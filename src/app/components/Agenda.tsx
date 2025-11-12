"use client";

import { Visita } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface AgendaProps {
  visitas: Visita[];
}

export function Agenda({ visitas }: AgendaProps) {
  const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  
  // Pegar próximos 7 dias
  const hoje = new Date();
  const proximosDias = Array.from({ length: 7 }, (_, i) => {
    const data = new Date(hoje);
    data.setDate(hoje.getDate() + i);
    return data;
  });

  const getVisitasDoDia = (data: Date) => {
    const dataStr = data.toISOString().split('T')[0];
    return visitas
      .filter(v => v.data === dataStr && v.status === 'agendada')
      .sort((a, b) => a.horario.localeCompare(b.horario));
  };

  const isHoje = (data: Date) => {
    return data.toDateString() === hoje.toDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="w-6 h-6 text-blue-500" />
        <h2 className="text-2xl font-bold">Agenda Semanal</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {proximosDias.map((data, index) => {
          const visitasDoDia = getVisitasDoDia(data);
          const ehHoje = isHoje(data);

          return (
            <Card 
              key={index} 
              className={`p-4 ${ehHoje ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/30' : ''}`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`font-semibold text-lg ${ehHoje ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                      {diasSemana[data.getDay()]}
                      {ehHoje && <span className="ml-2 text-sm">(Hoje)</span>}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {data.toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    visitasDoDia.length === 0 
                      ? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' 
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  }`}>
                    {visitasDoDia.length} {visitasDoDia.length === 1 ? 'visita' : 'visitas'}
                  </div>
                </div>

                <div className="space-y-2">
                  {visitasDoDia.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4 text-center">
                      Nenhuma visita agendada
                    </p>
                  ) : (
                    visitasDoDia.map((visita) => (
                      <div 
                        key={visita.id} 
                        className="p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-3">
                          <Clock className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{visita.horario}</span>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                {visita.tipo}
                              </span>
                            </div>
                            <p className="font-semibold text-sm mt-1">{visita.clienteNome}</p>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {visita.objetivo}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Resumo da semana */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
        <h3 className="font-semibold text-lg mb-4 text-purple-900 dark:text-purple-100">
          Resumo da Semana
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {visitas.filter(v => v.status === 'agendada').length}
            </p>
            <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">Agendadas</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {getVisitasDoDia(hoje).length}
            </p>
            <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">Hoje</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {proximosDias.reduce((acc, dia) => acc + getVisitasDoDia(dia).length, 0)}
            </p>
            <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">Próximos 7 dias</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {new Set(visitas.filter(v => v.status === 'agendada').map(v => v.clienteId)).size}
            </p>
            <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">Clientes</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
