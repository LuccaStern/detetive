
import CardsJSON from '@/data/cards.json'
import { CardType, CrimeType } from '@/types/types'
import { randomInt } from 'node:crypto'

export type Partida = {
    jogadores: string[]
    crime: CrimeType
    maos: Record<string, CardType[]>
    excedentes: CardType[]
}

function embaralhar<T>(cartas: T[]): T[] {
    const resultado = [...cartas]

    for (let i = resultado.length - 1; i > 0; i--) {
        const j = randomInt(i + 1)

        ;[resultado[i], resultado[j]] = [resultado[j], resultado[i]]
    }

    return resultado
}

export function criarPartida(jogadores: string[]): Partida {
    const cartas: CardType[] = CardsJSON.cards

    const locais = cartas.filter(c => c.type === 'local')
    const armas = cartas.filter(c => c.type === 'arma')
    const pessoas = cartas.filter(c => c.type === 'pessoa')

    // Sorteia o crime
    const crime: CrimeType = {
        local: locais[randomInt(locais.length)],
        arma: armas[randomInt(armas.length)],
        pessoa: pessoas[randomInt(pessoas.length)]
    }

    // Remove as cartas do crime
    const inocentes = cartas.filter(c =>
        c.name !== crime.local.name &&
        c.name !== crime.arma.name &&
        c.name !== crime.pessoa.name
    )

    // Embaralha as cartas restantes
    const baralho = embaralhar(inocentes)

    // Calcula quantas cartas cada jogador receberá
    const numeroDeCartas = Math.floor(
        baralho.length / jogadores.length
    )

    const cartasDistribuidas = numeroDeCartas * jogadores.length

    // Distribui as cartas
    const maos: Record<string, CardType[]> = {}

    jogadores.forEach((jogador, index) => {
        const inicio = index * numeroDeCartas
        const fim = inicio + numeroDeCartas

        maos[jogador] = baralho.slice(inicio, fim)
    })

    // Cartas que não puderam ser distribuídas
    const excedentes = baralho.slice(cartasDistribuidas)

    return {
        jogadores,
        crime,
        maos,
        excedentes
    }
}
