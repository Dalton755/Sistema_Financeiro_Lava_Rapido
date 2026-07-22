import { supabase }
  from '../lib/supabase'

export async function listarFuncionarios() {

  const {
    data,
    error
  } = await supabase

    .schema('financeiro')

    .from('funcionarios')

    .select(`
  *,
  lojas:loja_padrao_id (
    id,
    nome
  )
`)

    .order(
      'nome'
    )

  if (error)
    throw error

  return data

}

export async function criarFuncionario(funcionario) {

  const { data, error } = await supabase
    .schema("financeiro")
    .from("funcionarios")
    .insert([funcionario])
    .select()
    .single();

  if (error) throw error;

  const vigenciaInicial = data.created_at.substring(0, 10);

  const { error: erroHistorico } = await supabase
    .schema("financeiro")
    .from("funcionario_valor_hora")
    .insert([
      {
        funcionario_id: data.id,
        valor_hora: data.valor_hora,
        vigencia_inicio: vigenciaInicial,
        vigencia_fim: null
      }
    ]);

  if (erroHistorico) throw erroHistorico;

  return data;
}

export async function atualizarFuncionario(
  id,
  funcionario
) {

  const {
    data,
    error
  } = await supabase

    .schema('financeiro')

    .from('funcionarios')

    .update(
      funcionario
    )

    .eq(
      'id',
      id
    )

    .select()

    .single()

  if (error)
    throw error

  return data

}

export async function alterarValorHoraFuncionario(
  funcionarioId,
  novoValorHora,
  vigenciaInicio
) {
  const { error } = await supabase.rpc(
    "alterar_valor_hora_funcionario",
    {
      p_funcionario_id: funcionarioId,
      p_novo_valor: novoValorHora,
      p_vigencia_inicio: vigenciaInicio
    }
  );

  if (error) {
    throw error;
  }
}

export async function desativarFuncionario(
  id
) {

  const {
    data,
    error
  } = await supabase

    .schema('financeiro')

    .from('funcionarios')

    .update({

      status:
        'Inativo'

    })

    .eq(
      'id',
      id
    )

    .select()

    .single()

  if (error)
    throw error

  return data

}