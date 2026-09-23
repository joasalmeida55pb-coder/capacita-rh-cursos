-- Catálogo inicial de trilhas (espelha src/data/trilhas.ts).
-- NÃO foi executado. Rode no SQL Editor quando quiser que "Trilhas ativas" deixe de ser 0.
-- Idempotente: só insere títulos que ainda não existem.
insert into public.trilhas (titulo, setor, descricao, competencia_alvo, duracao_horas, ativa)
select v.titulo, v.setor, v.descricao, v.competencia_alvo, v.duracao_horas, true
from (values
  ('Recepção e Hospitalidade Hoteleira', 'turismo', 'Check-in, check-out, postura de hospitalidade e rotina de front office.', 'hospitalidade', 24),
  ('Inglês para Atendimento Turístico', 'ingles', 'Frases essenciais para receber, orientar e resolver pedidos de turistas.', 'ingles-basico', 30),
  ('Vendas e Atendimento no Varejo', 'comercio', 'Venda consultiva, negociação e experiência do cliente em loja física.', 'vendas-consultivas', 20),
  ('Operação de Caixa e PDV', 'comercio', 'Rotinas de caixa, meios de pagamento, fechamento e prevenção de erros.', 'caixa-pdv', 12),
  ('Garçom e Salão', 'gastronomia', 'Serviço de mesa, bebidas, comandas e trabalho em equipe no salão.', 'servico-mesa', 20),
  ('Boas Práticas na Manipulação de Alimentos', 'gastronomia', 'Higiene, conservação e segurança alimentar conforme a vigilância sanitária.', 'higiene-alimentos', 8),
  ('Governança e Arrumação Hoteleira', 'turismo', 'Padrões de arrumação, enxoval, produtos e produtividade na governança.', 'governanca', 16),
  ('Primeiros Socorros e Segurança no Atendimento', 'transversal', 'Primeiro atendimento, acionamento de emergência e prevenção de acidentes.', 'primeiros-socorros', 8)
) as v(titulo, setor, descricao, competencia_alvo, duracao_horas)
where not exists (select 1 from public.trilhas t where t.titulo = v.titulo);
