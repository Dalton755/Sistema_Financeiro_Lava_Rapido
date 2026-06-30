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

export async function criarFuncionario(
  funcionario
) {

  const {
    data,
    error
  } = await supabase

    .schema('financeiro')

    .from('funcionarios')

    .insert([
      funcionario
    ])

    .select()

    .single()

  if (error)
    throw error

  return data

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