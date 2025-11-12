"use client";

import { useState } from 'react';
import { Cliente, Visita } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Calendar, Clock, CheckCircle, XCircle, Video, Phone as PhoneIcon, User, TrendingUp } from 'lucide-react';

interface VisitasProps {
  visitas: Visita[];
  clientes: Cliente[];
  onAddVisita: (visita: Omit<Visita, 'id' | 'criadaEm'>) => void;
  onUpdateVisita: (id: string, visita: Partial<Visita>) => void;
  onDeleteVisita: (id: string) => void;
}

export function Visitas({ visitas, clientes, onAddVisita, onUpdateVisita, onDeleteVisita }: VisitasProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVisita, setEditingVisita] = useState<Visita | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('todas');
  const [formData, setFormData] = useState({
    clienteId: '',
    clienteNome: '',
    data: '',
    horario: '',
    tipo: 'presencial' as const,
    status: 'agendada' as const,
    objetivo: '',
    resultado: '',
    proximaAcao: '',
    valorNegociado: '',
    vendaRealizada: '',
  });

  const filteredVisitas = visitas
    .filter(v => filterStatus === 'todas' || v.status === filterStatus)
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cliente = clientes.find(c => c.id === formData.clienteId);
    if (!cliente) return;

    const visitaData = {
      clienteId: formData.clienteId,
      clienteNome: cliente.nome,
      data: formData.data,
      horario: formData.horario,
      tipo: formData.tipo,
      status: formData.status,
      objetivo: formData.objetivo,
      resultado: formData.resultado || undefined,
      proximaAcao: formData.proximaAcao || undefined,
      valorNegociado: formData.valorNegociado ? parseFloat(formData.valorNegociado) : undefined,
      vendaRealizada: formData.vendaRealizada === 'sim',
    };

    if (editingVisita) {
      onUpdateVisita(editingVisita.id, visitaData);
    } else {
      onAddVisita(visitaData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      clienteId: '',
      clienteNome: '',
      data: '',
      horario: '',
      tipo: 'presencial',
      status: 'agendada',
      objetivo: '',
      resultado: '',
      proximaAcao: '',
      valorNegociado: '',
      vendaRealizada: '',
    });
    setEditingVisita(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (visita: Visita) => {
    setEditingVisita(visita);
    setFormData({
      clienteId: visita.clienteId,
      clienteNome: visita.clienteNome,
      data: visita.data,
      horario: visita.horario,
      tipo: visita.tipo,
      status: visita.status,
      objetivo: visita.objetivo,
      resultado: visita.resultado || '',
      proximaAcao: visita.proximaAcao || '',
      valorNegociado: visita.valorNegociado?.toString() || '',
      vendaRealizada: visita.vendaRealizada ? 'sim' : 'nao',
    });
    setIsDialogOpen(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'agendada': return <Clock className="w-4 h-4 text-orange-500" />;
      case 'realizada': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelada': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'presencial': return <User className="w-4 h-4" />;
      case 'online': return <Video className="w-4 h-4" />;
      case 'telefone': return <PhoneIcon className="w-4 h-4" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendada': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'realizada': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelada': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          <Button
            size="sm"
            variant={filterStatus === 'todas' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('todas')}
          >
            Todas
          </Button>
          <Button
            size="sm"
            variant={filterStatus === 'agendada' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('agendada')}
          >
            Agendadas
          </Button>
          <Button
            size="sm"
            variant={filterStatus === 'realizada' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('realizada')}
          >
            Realizadas
          </Button>
          <Button
            size="sm"
            variant={filterStatus === 'cancelada' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('cancelada')}
          >
            Canceladas
          </Button>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Nova Visita
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingVisita ? 'Editar Visita' : 'Nova Visita'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="clienteId">Cliente *</Label>
                  <Select value={formData.clienteId} onValueChange={(value) => setFormData({ ...formData, clienteId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientes.map((cliente) => (
                        <SelectItem key={cliente.id} value={cliente.id}>
                          {cliente.nome} - {cliente.empresa}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="data">Data *</Label>
                  <Input
                    id="data"
                    type="date"
                    required
                    value={formData.data}
                    onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="horario">Horário *</Label>
                  <Input
                    id="horario"
                    type="time"
                    required
                    value={formData.horario}
                    onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo *</Label>
                  <Select value={formData.tipo} onValueChange={(value: any) => setFormData({ ...formData, tipo: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="presencial">Presencial</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="telefone">Telefone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agendada">Agendada</SelectItem>
                      <SelectItem value="realizada">Realizada</SelectItem>
                      <SelectItem value="cancelada">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="vendaRealizada" className="flex items-center gap-2">
                    Venda Realizada? *
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </Label>
                  <Select 
                    value={formData.vendaRealizada} 
                    onValueChange={(value) => setFormData({ ...formData, vendaRealizada: value })}
                  >
                    <SelectTrigger id="vendaRealizada">
                      <SelectValue placeholder="Selecione se houve venda" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sim">✓ Sim - Venda Realizada</SelectItem>
                      <SelectItem value="nao">✗ Não - Sem Venda</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="objetivo">Objetivo *</Label>
                  <Textarea
                    id="objetivo"
                    required
                    value={formData.objetivo}
                    onChange={(e) => setFormData({ ...formData, objetivo: e.target.value })}
                    rows={2}
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="resultado">Resultado</Label>
                  <Textarea
                    id="resultado"
                    value={formData.resultado}
                    onChange={(e) => setFormData({ ...formData, resultado: e.target.value })}
                    rows={2}
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="proximaAcao">Próxima Ação</Label>
                  <Textarea
                    id="proximaAcao"
                    value={formData.proximaAcao}
                    onChange={(e) => setFormData({ ...formData, proximaAcao: e.target.value })}
                    rows={2}
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-green-500 to-green-600">
                  {editingVisita ? 'Atualizar' : 'Cadastrar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de visitas */}
      <div className="space-y-4">
        {filteredVisitas.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhuma visita encontrada</p>
          </div>
        ) : (
          filteredVisitas.map((visita) => (
            <Card key={visita.id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-lg">{visita.clienteNome}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(visita.data).toLocaleDateString('pt-BR')}</span>
                        <Clock className="w-3 h-3 ml-2" />
                        <span>{visita.horario}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getTipoIcon(visita.tipo)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(visita.status)}`}>
                        {visita.status}
                      </span>
                    </div>
                  </div>

                  {visita.vendaRealizada !== undefined && (
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                      visita.vendaRealizada 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                    }`}>
                      <TrendingUp className="w-4 h-4" />
                      {visita.vendaRealizada ? 'Venda Realizada' : 'Sem Venda'}
                    </div>
                  )}

                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Objetivo:</span>
                      <p className="text-muted-foreground mt-1">{visita.objetivo}</p>
                    </div>
                    {visita.resultado && (
                      <div>
                        <span className="font-medium">Resultado:</span>
                        <p className="text-muted-foreground mt-1">{visita.resultado}</p>
                      </div>
                    )}
                    {visita.proximaAcao && (
                      <div>
                        <span className="font-medium">Próxima Ação:</span>
                        <p className="text-muted-foreground mt-1">{visita.proximaAcao}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex sm:flex-col gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 sm:flex-none"
                    onClick={() => handleEdit(visita)}
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 sm:flex-none text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                    onClick={() => {
                      if (confirm('Deseja realmente excluir esta visita?')) {
                        onDeleteVisita(visita.id);
                      }
                    }}
                  >
                    Excluir
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
