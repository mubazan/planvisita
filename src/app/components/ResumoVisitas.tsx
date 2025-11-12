"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Visita } from '@/lib/types';
import { TrendingUp, TrendingDown, Calendar, DollarSign, Target } from 'lucide-react';
import { useMemo } from 'react';

interface ResumoVisitasProps {
  visitas: Visita[];
}

export function ResumoVisitas({ visitas }: ResumoVisitasProps) {
  const resumo = useMemo(() => {
    const hoje = new Date();
    const inicioSemana = new Date(hoje);
    inicioSemana.setDate(hoje.getDate() - hoje.getDay());
    inicioSemana.setHours(0, 0, 0, 0);

    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

    // Filtrar visitas realizadas
    const visitasRealizadas = visitas.filter(v => v.status === 'realizada');

    // Semanal
    const visitasSemana = visitasRealizadas.filter(v => {
      const dataVisita = new Date(v.data);
      return dataVisita >= inicioSemana;
    });

    // Contar vendas usando o campo vendaRealizada (booleano)
    const vendasSemana = visitasSemana.filter(v => v.vendaRealizada === true).length;
    const taxaConversaoSemana = visitasSemana.length > 0 
      ? (vendasSemana / visitasSemana.length) * 100 
      : 0;

    // Mensal
    const visitasMes = visitasRealizadas.filter(v => {
      const dataVisita = new Date(v.data);
      return dataVisita >= inicioMes;
    });

    // Contar vendas usando o campo vendaRealizada (booleano)
    const vendasMes = visitasMes.filter(v => v.vendaRealizada === true).length;
    const taxaConversaoMes = visitasMes.length > 0 
      ? (vendasMes / visitasMes.length) * 100 
      : 0;

    return {
      semanal: {
        visitas: visitasSemana.length,
        vendas: vendasSemana,
        taxaConversao: taxaConversaoSemana,
      },
      mensal: {
        visitas: visitasMes.length,
        vendas: vendasMes,
        taxaConversao: taxaConversaoMes,
      }
    };
  }, [visitas]);

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-blue-200 dark:border-blue-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
          <Target className="w-5 h-5" />
          Resumo Automático de Visitas
        </CardTitle>
        <CardDescription>
          Acompanhe seu desempenho em visitas e vendas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Resumo Semanal */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-blue-800 dark:text-blue-200">
            <Calendar className="w-4 h-4" />
            Esta Semana
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Visitas */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Visitas</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {resumo.semanal.visitas}
                  </p>
                </div>
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

            {/* Vendas */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Vendas</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {resumo.semanal.vendas}
                  </p>
                </div>
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>

            {/* Taxa de Conversão */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Conversão</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {resumo.semanal.taxaConversao.toFixed(0)}%
                  </p>
                </div>
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  {resumo.semanal.taxaConversao >= 50 ? (
                    <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Mensagem resumo semanal */}
          {resumo.semanal.visitas > 0 && (
            <div className="bg-blue-100 dark:bg-blue-900/20 rounded-lg p-3 text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium">
                📊 Você visitou <span className="font-bold">{resumo.semanal.visitas}</span> cliente{resumo.semanal.visitas !== 1 ? 's' : ''} e fechou <span className="font-bold">{resumo.semanal.vendas}</span> venda{resumo.semanal.vendas !== 1 ? 's' : ''} esta semana
              </p>
            </div>
          )}
        </div>

        {/* Divisor */}
        <div className="border-t border-blue-200 dark:border-blue-800"></div>

        {/* Resumo Mensal */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-purple-800 dark:text-purple-200">
            <Calendar className="w-4 h-4" />
            Este Mês
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Visitas */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Visitas</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {resumo.mensal.visitas}
                  </p>
                </div>
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

            {/* Vendas */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Vendas</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {resumo.mensal.vendas}
                  </p>
                </div>
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>

            {/* Taxa de Conversão */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Conversão</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {resumo.mensal.taxaConversao.toFixed(0)}%
                  </p>
                </div>
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  {resumo.mensal.taxaConversao >= 50 ? (
                    <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Mensagem resumo mensal */}
          {resumo.mensal.visitas > 0 && (
            <div className="bg-purple-100 dark:bg-purple-900/20 rounded-lg p-3 text-sm text-purple-800 dark:text-purple-200">
              <p className="font-medium">
                📊 Você visitou <span className="font-bold">{resumo.mensal.visitas}</span> cliente{resumo.mensal.visitas !== 1 ? 's' : ''} e fechou <span className="font-bold">{resumo.mensal.vendas}</span> venda{resumo.mensal.vendas !== 1 ? 's' : ''} este mês
              </p>
            </div>
          )}
        </div>

        {/* Gráfico Visual Simples */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Comparativo Visual
          </p>
          
          {/* Semanal */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Semana</span>
              <span>{resumo.semanal.visitas} visitas</span>
            </div>
            <div className="flex gap-1 h-8">
              {/* Barra de Visitas */}
              <div 
                className="bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold transition-all"
                style={{ width: resumo.semanal.visitas > 0 ? '60%' : '0%' }}
              >
                {resumo.semanal.visitas > 0 && resumo.semanal.visitas}
              </div>
              {/* Barra de Vendas */}
              <div 
                className="bg-green-500 rounded flex items-center justify-center text-white text-xs font-bold transition-all"
                style={{ width: resumo.semanal.vendas > 0 ? '40%' : '0%' }}
              >
                {resumo.semanal.vendas > 0 && resumo.semanal.vendas}
              </div>
            </div>
          </div>

          {/* Mensal */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Mês</span>
              <span>{resumo.mensal.visitas} visitas</span>
            </div>
            <div className="flex gap-1 h-8">
              {/* Barra de Visitas */}
              <div 
                className="bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold transition-all"
                style={{ width: resumo.mensal.visitas > 0 ? '60%' : '0%' }}
              >
                {resumo.mensal.visitas > 0 && resumo.mensal.visitas}
              </div>
              {/* Barra de Vendas */}
              <div 
                className="bg-green-600 rounded flex items-center justify-center text-white text-xs font-bold transition-all"
                style={{ width: resumo.mensal.vendas > 0 ? '40%' : '0%' }}
              >
                {resumo.mensal.vendas > 0 && resumo.mensal.vendas}
              </div>
            </div>
          </div>

          {/* Legenda */}
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Visitas</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Vendas</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
