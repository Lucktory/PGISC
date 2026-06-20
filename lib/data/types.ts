export type Sexo = "M" | "F";

export type TipoAtendimento = "Passivo" | "Ativo" | "Suspensao";

export type PeriodoDia = "Manha" | "Tarde" | "Noite";

export type DiaSemana = "Seg" | "Ter" | "Qua" | "Qui" | "Sex" | "Sab" | "Dom";

export type PeriodoMes = "2025-11" | "2025-12" | "2026-01";

export type MarkerImportacao = "validado" | "legado-revisar";

export type RoleUsuario = "Admin" | "Operador" | "Visualizador";

export interface Cid {
  codigo: string;
  nome: string;
  capitulo: string;
  capituloNome: string;
  bloco: string;
}

export interface Empresa {
  id: string;
  nome: string;
  cnpj: string;
  custoHoraPadrao: number;
  colaboradoresAtivos: Record<PeriodoMes, number>;
}

export interface Pessoa {
  prontuario: string;
  nome: string;
  sexo: Sexo;
  dataNascimento: string;
}

export interface VinculoEmpresa {
  prontuario: string;
  empresaId: string;
  cargo: string;
  setor: string;
  dataAdmissao: string;
  dataSaida?: string;
}

export interface Medico {
  nome: string;
  crm: string;
  especialidade: string;
}

export interface Atendimento {
  id: string;
  empresaId: string;
  prontuario: string;
  nome: string;
  sexo: Sexo;
  cargo: string;
  setor: string;
  dataAdmissao: string;
  dataNascimento: string;
  dataAtendimento: string;
  tipoAtendimento: TipoAtendimento;
  localAtendimento: string;
  motivo: string;
  tipoExame: string;
  cid: string;
  conduta: string;
  necessidadeAfastamento: boolean;
  horasPerdidas: number;
  diasPerdidos: number;
  medicoResponsavel: string;
  observacoes: string;
  marker?: MarkerImportacao;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  role: RoleUsuario;
  ultimoAcesso: string;
}

export interface FilterState {
  empresaId: string;
  periodo: PeriodoMes;
  setores?: string[];
  cargos?: string[];
}

export interface RelatorioGerado {
  id: string;
  empresaId: string;
  periodo: PeriodoMes;
  geradoEm: string;
  tamanhoBytes: number;
}
