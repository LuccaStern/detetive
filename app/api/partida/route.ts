
import { NextRequest, NextResponse } from 'next/server'
import { criarPartida, Partida } from '@/lib/partida'

// Armazenamento temporário em memória
const globalForPartidas = globalThis as typeof globalThis & {
    partidasDetetive?: Map<string, Partida>
}

const partidas = globalForPartidas.partidasDetetive ?? new Map<string, Partida>()

globalForPartidas.partidasDetetive = partidas

export async function POST(request: NextRequest) {
    try {
        const { roomId, playerId, playerIds } = await request.json()

        // Validação dos dados recebidos
        if (
            typeof roomId !== 'string' ||
            typeof playerId !== 'string' ||
            !Array.isArray(playerIds) ||
            playerIds.length < 1 ||
            playerIds.length > 4 ||
            !playerIds.every((id: unknown) => typeof id === 'string' && id.length > 0) ||
            new Set(playerIds).size !== playerIds.length ||
            !playerIds.includes(playerId)
        ) {
            return NextResponse.json(
                { error: 'Dados inválidos.' },
                { status: 400 }
            )
        }

        // Verifica se a partida já existe
        let partida = partidas.get(roomId)

        // Se não existir, cria uma nova
        if (!partida) {
            partida = criarPartida(playerIds)
            partidas.set(roomId, partida)
        }

        // Verifica se os jogadores pertencem à partida
        const jogadoresValidos =
            playerIds.length === partida.jogadores.length &&
            playerIds.every(id => partida!.jogadores.includes(id))

        if (!jogadoresValidos) {
            return NextResponse.json(
                { error: 'Lista de jogadores incompatível com a partida.' },
                { status: 409 }
            )
        }

        if (!partida.jogadores.includes(playerId)) {
            return NextResponse.json(
                { error: 'Jogador não pertence à partida.' },
                { status: 403 }
            )
        }

        // Retorna somente a mão do jogador e as cartas públicas
        return NextResponse.json({
            cartas: partida.maos[playerId],
            excedentes: partida.excedentes
        })

    } catch {
        return NextResponse.json(
            { error: 'Erro ao iniciar a partida.' },
            { status: 500 }
        )
    }
}
