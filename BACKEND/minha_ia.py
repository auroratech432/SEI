#Esqueleto da IA esta bem ruim e com nomes genericos, pois preciso dos dados reais para funcionar
#Por enquanto o esqueleto é esse

import pandas as pd
import json
from datetime import datetime

# Função para carregar dados de disponibilidade dos professores
def load_professores_disponibilidade():
    return pd.read_csv('professores_disponibilidade.csv')

# Função para carregar dados de disponibilidade das salas
def load_salas_disponibilidade():
    return pd.read_csv('salas_disponibilidade.csv')

# Função para carregar dados de disponibilidade dos alunos
def load_alunos_disponibilidade():
    return pd.read_csv('alunos_disponibilidade.csv')

# Função para carregar dados de matérias
def load_materias():
    return pd.read_csv('materias.csv')


# Função para verificar se duas janelas de horário se sobrepõem
def check_overlap(schedule1, schedule2):
    for s1 in schedule1:
        for s2 in schedule2:
            if s1[1] > s2[0] and s2[1] > s1[0]:  # Se houver sobreposição de horários
                return True
    return False

# Função para distribuir as matérias, alunos e professores nas salas
def distribuir_aulas(professores, salas, alunos, materias):
    aulas_distribuidas = []

    for _, materia in materias.iterrows():
        carga_horaria = materia['carga_horaria']
        materia_nome = materia['nome']

        # Encontrar um professor disponível
        for _, professor in professores.iterrows():
            professor_id = professor['professor_id']
            disponibilidade_professor = parse_schedule(professor['disponibilidade'])

            # Procurar uma sala disponível
            for _, sala in salas.iterrows():
                sala_id = sala['sala_id']
                disponibilidade_sala = parse_schedule(sala['disponibilidade'])

                if not check_overlap(disponibilidade_professor, disponibilidade_sala):
                    continue  # Se houver conflito de horários, tentamos outra combinação

                # A alocação de alunos será feita conforme a disponibilidade
                alunos_alocados = []
                for _, aluno in alunos.iterrows():
                    aluno_id = aluno['aluno_id']
                    disponibilidade_aluno = parse_schedule(aluno['disponibilidade'])

                    if not check_overlap(disponibilidade_aluno, disponibilidade_sala):
                        alunos_alocados.append(aluno_id)

                if len(alunos_alocados) > 0:
                    aulas_distribuidas.append({
                        "materia": materia_nome,
                        "professor_id": professor_id,
                        "sala_id": sala_id,
                        "alunos": alunos_alocados,
                        "horario": disponibilidade_sala
                    })
                    break  # Para essa matéria, já conseguimos alocar

    return aulas_distribuidas

# Função auxiliar para converter a string de disponibilidade para lista de horários
def parse_schedule(schedule):
    timeslots = schedule.split(',')
    parsed_schedule = []
    for timeslot in timeslots:
        start_time, end_time = timeslot.split('-')
        start_time = datetime.strptime(start_time.strip(), "%Y-%m-%d %H:%M")
        end_time = datetime.strptime(end_time.strip(), "%Y-%m-%d %H:%M")
        parsed_schedule.append((start_time, end_time))
    return parsed_schedule


def main():
    # Carregar os dados
    professores = load_professores_disponibilidade()
    salas = load_salas_disponibilidade()
    alunos = load_alunos_disponibilidade()
    materias = load_materias()

    # Distribuir as aulas
    aulas_distribuidas = distribuir_aulas(professores, salas, alunos, materias)

    # Exibir a alocação de aulas
    for aula in aulas_distribuidas:
        print(f"Matéria: {aula['materia']}")
        print(f"Professor: {aula['professor_id']}")
        print(f"Sala: {aula['sala_id']}")
        print(f"Alunos: {aula['alunos']}")
        print(f"Horário: {aula['horario']}")
        print("-" * 50)

if __name__ == "__main__":
    main()