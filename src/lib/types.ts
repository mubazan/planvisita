// RepRoute CRM - Types

export interface Cliente {
  id: string;
  nome: string;
  empresa: string;
  telefone: string;
  email: string;
  endereco: string;
  cidade: string;
  estado: string;
  segmento: string;
  status: 'ativo' | 'inativo' | 'prospecto';
  observacoes?: string;
  criadoEm: string;
}

export interface Visita {
  id: string;
  clienteId: string;
  clienteNome: string;
  data: string;
  horario: string;
  tipo: 'presencial' | 'online' | 'telefone';
  status: 'agendada' | 'realizada' | 'cancelada';
  objetivo: string;
  resultado?: string;
  proximaAcao?: string;
  valorNegociado?: number;
  vendaRealizada?: boolean;
  criadaEm: string;
}

export interface AgendaSemanal {
  [dia: string]: Visita[];
}

export interface Metricas {
  totalClientes: number;
  clientesAtivos: number;
  visitasRealizadas: number;
  visitasAgendadas: number;
  valorTotalNegociado: number;
  taxaConversao: number;
}
