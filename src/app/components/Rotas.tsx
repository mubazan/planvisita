"use client";

import { useState, useMemo, useEffect } from 'react';
import { Cliente, Visita } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Navigation, Calendar, Clock, Building2, Phone, ExternalLink, Loader2 } from 'lucide-react';

interface RotasProps {
  clientes: Cliente[];
  visitas: Visita[];
}

interface RotaSugerida {
  dia: string;
  clientes: Cliente[];
  distanciaEstimada: string;
}

export function Rotas({ clientes, visitas }: RotasProps) {
  const [regiaoSelecionada, setRegiaoSelecionada] = useState('');
  const [diaSemana, setDiaSemana] = useState('');
  const [rotaGerada, setRotaGerada] = useState(false);
  const [localizacaoAtual, setLocalizacaoAtual] = useState<{lat: number, lng: number} | null>(null);
  const [carregandoLocalizacao, setCarregandoLocalizacao] = useState(false);
  const [enderecoPartida, setEnderecoPartida] = useState('');

  // Obter localização atual do usuário
  useEffect(() => {
    if (navigator.geolocation) {
      setCarregandoLocalizacao(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocalizacaoAtual({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setCarregandoLocalizacao(false);
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
          setCarregandoLocalizacao(false);
        }
      );
    }
  }, []);

  // Extrair cidades únicas dos clientes
  const cidadesDisponiveis = useMemo(() => {
    const cidades = new Set(clientes.map(c => c.cidade));
    return Array.from(cidades).sort();
  }, [clientes]);

  // Filtrar clientes por região
  const clientesDaRegiao = useMemo(() => {
    if (!regiaoSelecionada) return [];
    return clientes.filter(c => 
      c.cidade.toLowerCase().includes(regiaoSelecionada.toLowerCase()) &&
      c.status === 'ativo'
    );
  }, [clientes, regiaoSelecionada]);

  // Sugerir rota otimizada
  const rotaSugerida = useMemo(() => {
    if (clientesDaRegiao.length === 0) return null;

    // Agrupar por proximidade (mesma cidade)
    const clientesOrdenados = [...clientesDaRegiao].sort((a, b) => {
      // Priorizar clientes com visitas agendadas
      const visitasA = visitas.filter(v => v.clienteId === a.id && v.status === 'agendada').length;
      const visitasB = visitas.filter(v => v.clienteId === b.id && v.status === 'agendada').length;
      
      if (visitasA !== visitasB) return visitasB - visitasA;
      
      // Depois ordenar por nome
      return a.nome.localeCompare(b.nome);
    });

    return {
      dia: diaSemana || 'Dia selecionado',
      clientes: clientesOrdenados,
      distanciaEstimada: `${clientesOrdenados.length * 15} km`,
    };
  }, [clientesDaRegiao, diaSemana, visitas]);

  const diasSemana = [
    { value: 'segunda', label: 'Segunda-feira' },
    { value: 'terca', label: 'Terça-feira' },
    { value: 'quarta', label: 'Quarta-feira' },
    { value: 'quinta', label: 'Quinta-feira' },
    { value: 'sexta', label: 'Sexta-feira' },
  ];

  const handleGerarRota = () => {
    if (!regiaoSelecionada || !diaSemana) {
      alert('Selecione uma região e um dia da semana');
      return;
    }
    setRotaGerada(true);
  };

  const handleAbrirNoGoogleMaps = () => {
    if (!rotaSugerida || rotaSugerida.clientes.length === 0) return;

    // Construir URL do Google Maps com múltiplos waypoints
    const enderecos = rotaSugerida.clientes
      .filter(c => c.endereco && c.cidade)
      .map(c => `${c.endereco}, ${c.cidade}`)
      .filter(e => e.trim().length > 0);

    if (enderecos.length === 0) {
      alert('Nenhum cliente possui endereço completo cadastrado');
      return;
    }

    // Google Maps suporta até 10 waypoints na URL
    const enderecosPrimeiros = enderecos.slice(0, 10);
    
    let url = 'https://www.google.com/maps/dir/';
    
    // Adicionar ponto de partida (localização atual ou endereço manual)
    if (localizacaoAtual) {
      url += `${localizacaoAtual.lat},${localizacaoAtual.lng}/`;
    } else if (enderecoPartida.trim()) {
      url += `${encodeURIComponent(enderecoPartida)}/`;
    }
    
    // Adicionar destinos
    url += enderecosPrimeiros.map(e => encodeURIComponent(e)).join('/');

    window.open(url, '_blank');
  };

  const handleAbrirEnderecoIndividual = (cliente: Cliente) => {
    if (!cliente.endereco || !cliente.cidade) {
      alert('Cliente não possui endereço completo cadastrado');
      return;
    }

    const enderecoCompleto = `${cliente.endereco}, ${cliente.cidade}`;
    
    // Se tiver localização atual, criar rota do ponto atual até o cliente
    let url = '';
    if (localizacaoAtual) {
      url = `https://www.google.com/maps/dir/${localizacaoAtual.lat},${localizacaoAtual.lng}/${encodeURIComponent(enderecoCompleto)}`;
    } else if (enderecoPartida.trim()) {
      url = `https://www.google.com/maps/dir/${encodeURIComponent(enderecoPartida)}/${encodeURIComponent(enderecoCompleto)}`;
    } else {
      url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(enderecoCompleto)}`;
    }
    
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg">
          <Navigation className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Planejamento de Rotas</h2>
          <p className="text-sm text-muted-foreground">
            Monte sua rota de visitas semanal de forma inteligente
          </p>
        </div>
      </div>

      {/* Filtros */}
      <Card className="p-6">
        <div className="space-y-4">
          {/* Localização de Partida */}
          <div className="space-y-2">
            <Label htmlFor="partida">Ponto de Partida</Label>
            <div className="flex gap-2">
              <Input
                id="partida"
                placeholder={
                  carregandoLocalizacao 
                    ? "Obtendo localização..." 
                    : localizacaoAtual 
                      ? `Localização atual (${localizacaoAtual.lat.toFixed(4)}, ${localizacaoAtual.lng.toFixed(4)})` 
                      : "Digite seu endereço de partida"
                }
                value={enderecoPartida}
                onChange={(e) => setEnderecoPartida(e.target.value)}
                disabled={carregandoLocalizacao}
              />
              {carregandoLocalizacao && (
                <Button disabled variant="outline">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </Button>
              )}
              {localizacaoAtual && (
                <Button 
                  variant="outline" 
                  className="whitespace-nowrap"
                  onClick={() => {
                    setEnderecoPartida('');
                    setLocalizacaoAtual(null);
                    if (navigator.geolocation) {
                      setCarregandoLocalizacao(true);
                      navigator.geolocation.getCurrentPosition(
                        (position) => {
                          setLocalizacaoAtual({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                          });
                          setCarregandoLocalizacao(false);
                        },
                        (error) => {
                          console.error('Erro ao obter localização:', error);
                          setCarregandoLocalizacao(false);
                        }
                      );
                    }
                  }}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Atualizar
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {localizacaoAtual 
                ? "✓ Usando sua localização atual como ponto de partida" 
                : "Digite um endereço ou permita acesso à localização"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="regiao">Região / Cidade</Label>
              <Select value={regiaoSelecionada} onValueChange={setRegiaoSelecionada}>
                <SelectTrigger id="regiao">
                  <SelectValue placeholder="Selecione uma cidade" />
                </SelectTrigger>
                <SelectContent>
                  {cidadesDisponiveis.map((cidade) => (
                    <SelectItem key={cidade} value={cidade}>
                      {cidade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dia">Dia da Semana</Label>
              <Select value={diaSemana} onValueChange={setDiaSemana}>
                <SelectTrigger id="dia">
                  <SelectValue placeholder="Selecione o dia" />
                </SelectTrigger>
                <SelectContent>
                  {diasSemana.map((dia) => (
                    <SelectItem key={dia.value} value={dia.value}>
                      {dia.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button 
            onClick={handleGerarRota}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
          >
            <Navigation className="w-4 h-4 mr-2" />
            Gerar Rota
          </Button>
          {rotaGerada && rotaSugerida && rotaSugerida.clientes.length > 0 && (
            <Button 
              onClick={handleAbrirNoGoogleMaps}
              variant="outline"
              className="border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Abrir no Google Maps
            </Button>
          )}
          <Button 
            variant="outline"
            onClick={() => {
              setRegiaoSelecionada('');
              setDiaSemana('');
              setRotaGerada(false);
            }}
          >
            Limpar
          </Button>
        </div>
      </Card>

      {/* Rota Sugerida */}
      {rotaGerada && rotaSugerida && rotaSugerida.clientes.length > 0 && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Rota Sugerida</h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{diasSemana.find(d => d.value === diaSemana)?.label}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{rotaSugerida.distanciaEstimada}</span>
                </div>
              </div>
            </div>

            {/* Ponto de Partida */}
            {(localizacaoAtual || enderecoPartida) && (
              <div className="p-4 rounded-lg border-2 border-blue-500 bg-blue-50 dark:bg-blue-950">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold">Ponto de Partida</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {enderecoPartida || `Localização atual (${localizacaoAtual?.lat.toFixed(4)}, ${localizacaoAtual?.lng.toFixed(4)})`}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {rotaSugerida.clientes.map((cliente, index) => {
                const visitasAgendadas = visitas.filter(
                  v => v.clienteId === cliente.id && v.status === 'agendada'
                );
                const temVisitaAgendada = visitasAgendadas.length > 0;

                return (
                  <div
                    key={cliente.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      temVisitaAgendada
                        ? 'border-green-500 bg-green-50 dark:bg-green-950'
                        : 'border-gray-200 dark:border-gray-700 hover:border-orange-500'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold truncate">{cliente.nome}</h4>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                              <Building2 className="w-3 h-3" />
                              <span className="truncate">{cliente.empresa}</span>
                            </div>
                          </div>
                          {temVisitaAgendada && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 whitespace-nowrap">
                              Agendada
                            </span>
                          )}
                        </div>

                        <div className="mt-2 space-y-1 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{cliente.endereco || 'Endereço não informado'}</span>
                            {cliente.endereco && cliente.cidade && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 px-2 text-xs"
                                onClick={() => handleAbrirEnderecoIndividual(cliente)}
                              >
                                <ExternalLink className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="w-3 h-3" />
                            <span>{cliente.telefone}</span>
                          </div>
                          {temVisitaAgendada && visitasAgendadas[0].horario && (
                            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium">
                              <Clock className="w-3 h-3" />
                              <span>{visitasAgendadas[0].horario}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Resumo da Rota */}
            <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {rotaSugerida.clientes.length}
                  </p>
                  <p className="text-xs text-muted-foreground">Clientes</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {rotaSugerida.distanciaEstimada}
                  </p>
                  <p className="text-xs text-muted-foreground">Distância</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {rotaSugerida.clientes.length * 45}min
                  </p>
                  <p className="text-xs text-muted-foreground">Tempo Estimado</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {visitas.filter(v => 
                      rotaSugerida.clientes.some(c => c.id === v.clienteId) && 
                      v.status === 'agendada'
                    ).length}
                  </p>
                  <p className="text-xs text-muted-foreground">Agendadas</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Estado vazio */}
      {(!regiaoSelecionada || !diaSemana) && (
        <Card className="p-12">
          <div className="text-center space-y-3">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <Navigation className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold">Planeje sua Rota</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Selecione uma região e um dia da semana para gerar uma rota otimizada de visitas
            </p>
          </div>
        </Card>
      )}

      {/* Sem clientes na região */}
      {regiaoSelecionada && diaSemana && clientesDaRegiao.length === 0 && (
        <Card className="p-12">
          <div className="text-center space-y-3">
            <MapPin className="w-12 h-12 mx-auto text-muted-foreground" />
            <h3 className="text-lg font-semibold">Nenhum cliente encontrado</h3>
            <p className="text-sm text-muted-foreground">
              Não há clientes ativos cadastrados em {regiaoSelecionada}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
